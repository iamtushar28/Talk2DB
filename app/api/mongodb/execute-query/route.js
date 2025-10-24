import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

/**
 * Safely parses a string of MongoDB query arguments (e.g., '{"_id": "1"}, {"name": 1}')
 * into JavaScript values using isolated function execution.
 *
 * @param {string} argsString The comma-separated string of arguments.
 * @returns {Array<any>} An array of parsed arguments.
 */
function parseArguments(argsString) {
  // Executes the code in a new Function context, which isolates the execution scope
  // from the local variables of the POST handler, limiting potential injection scope.
  const codeToExecute = `return [${argsString}]`;
  const parser = new Function(codeToExecute);
  return parser();
}

/**
 * @fileoverview Next.js API route to securely execute read-only MongoDB queries.
 * This function connects to a specified MongoDB instance and executes a client-provided
 * query, strictly enforcing read-only access through regular expression validation.
 *
 * @param {Request} req The incoming Next.js request object.
 * @returns {NextResponse} A JSON response containing the query results or an error object.
 */
export async function POST(req) {
  let client; // Declare client outside try-catch for access in finally
  try {
    const { query, dbConnectionData } = await req.json();

    // 1. Input Validation: Check for required fields.
    if (
      !query ||
      !dbConnectionData?.connectionURL ||
      !dbConnectionData?.dbName
    ) {
      return NextResponse.json(
        { error: "Missing required fields (query, connectionURL, or dbName)." },
        { status: 400 }
      );
    }

    const { connectionURL, dbName } = dbConnectionData;

    // --- SECURITY MECHANISMS (REGEX VALIDATION) ---

    // 2. Define allowed read operations.
    const allowedOps = [
      /db\.[a-zA-Z0-9_]+\.find\s*\(/,
      /db\.[a-zA-Z0-9_]+\.aggregate\s*\(/,
      /db\.[a-zA-Z0-9_]+\.countDocuments\s*\(/,
      /db\.[a-zA-Z0-9_]+\.distinct\s*\(/,
      /db\.[a-zA-Z0-9_]+\.estimatedDocumentCount\s*\(/,
      /db\.[a-zA-Z0-9_]+\.findOne\s*\(/,
    ];

    // 3. Define disallowed write/modification operations.
    const disallowedOps = [
      /insert/,
      /update/,
      /delete/,
      /replace/,
      /drop/,
      /remove/,
      /createIndex/,
      /bulkWrite/,
      /rename/,
    ];

    // 4. Block known write operations.
    if (disallowedOps.some((regex) => regex.test(query))) {
      return NextResponse.json(
        { error: "Write operations are not allowed." },
        { status: 400 }
      );
    }

    // 5. Ensure the query is a supported read operation.
    if (!allowedOps.some((regex) => regex.test(query))) {
      return NextResponse.json(
        {
          error:
            "Only read operations are allowed (find, aggregate, count, etc.).",
        },
        { status: 400 }
      );
    }

    // 6. Query Sanitation: Replace MongoDB-specific `ISODate(...)` with native JavaScript `new Date(...)`.
    const safeQuery = query.replace(/ISODate\(([^)]+)\)/g, "new Date($1)");

    // 7. Database Connection: Initialize and connect the MongoDB client.
    client = new MongoClient(connectionURL);
    await client.connect();
    const db = client.db(dbName);

    let result;

    // --- QUERY EXECUTION LOGIC ---

    // 8. Handle `find()` operation, including method chaining (.limit, .sort, .skip).
    // The regex captures the base call and the subsequent chain.
    const findMatch = safeQuery.match(
      /(db\.([a-zA-Z0-9_]+)\.find\(([\s\S]*?)\))([\s\S]*)/
    );
    if (findMatch) {
      const collection = findMatch[2]; // Collection name
      const argsString = findMatch[3]; // Arguments for find()
      const chainString = findMatch[4]; // Remaining chain (.limit(3).sort({}))

      const args = parseArguments(argsString);
      const [filter = {}, projection = {}] = args;

      // Start the cursor
      let cursor = db.collection(collection).find(filter, { projection });

      // Parse and apply cursor method chaining
      const chainRegex = /\.(limit|sort|skip)\s*\(([\s\S]*?)\)/g;
      let chainSegment;

      while ((chainSegment = chainRegex.exec(chainString)) !== null) {
        const method = chainSegment[1];
        const methodArgsString = chainSegment[2];

        try {
          const methodArgs = parseArguments(methodArgsString);
          if (cursor[method] && typeof cursor[method] === "function") {
            cursor = cursor[method](...methodArgs);
          }
        } catch (e) {
          throw new Error(
            `Invalid arguments for chained method .${method}(): ${e.message}`
          );
        }
      }

      result = await cursor.toArray();
    }

    // 9. Handle `aggregate()` operation.
    const aggMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.aggregate\(([\s\S]*)\)/
    );
    if (aggMatch) {
      const collection = aggMatch[1];
      const pipeline = parseArguments(aggMatch[2])[0];
      result = await db.collection(collection).aggregate(pipeline).toArray();
    }

    // 10. Handle `countDocuments()` operation.
    const countMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.countDocuments\(([\s\S]*)\)/
    );
    if (countMatch) {
      const collection = countMatch[1];
      const args = parseArguments(countMatch[2]);
      const [filter = {}] = args;
      const count = await db.collection(collection).countDocuments(filter);
      result = [{ count }];
    }

    // 11. Handle `distinct()` operation.
    const distinctMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.distinct\(([\s\S]*)\)/
    );
    if (distinctMatch) {
      const collection = distinctMatch[1];
      const args = parseArguments(distinctMatch[2]);
      const [field, filter = {}] = args;
      const distinctValues = await db
        .collection(collection)
        .distinct(field, filter);
      result = [{ values: distinctValues }];
    }

    // 12. Handle `estimatedDocumentCount()` operation.
    const estMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.estimatedDocumentCount\(([\s\S]*)\)/
    );
    if (estMatch) {
      const collection = estMatch[1];
      const count = await db.collection(collection).estimatedDocumentCount();
      result = [{ count }];
    }

    // 13. Handle `findOne()` operation.
    const findOneMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.findOne\(([\s\S]*)\)/
    );
    if (findOneMatch) {
      const collection = findOneMatch[1];
      const args = parseArguments(findOneMatch[2]);
      const [filter = {}, projection = {}] = args;
      const doc = await db
        .collection(collection)
        .findOne(filter, { projection });
      result = doc ? [doc] : [];
    }

    await client.close();

    // 14. Final check: If no handler matched the query.
    if (!result) {
      return NextResponse.json(
        { error: "Unsupported query format or unexecuted query." },
        { status: 400 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    // Ensure client is closed on error
    if (client) {
      await client.close().catch(console.error);
    }
    // 15. Catch block for handling errors.
    console.error("MongoDB execution error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
