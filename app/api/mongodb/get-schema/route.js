import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

/**
 * Accurately determines the BSON type of a MongoDB document field.
 * @param {*} value The field value.
 * @returns {string} The derived BSON type name.
 */
function getBSONType(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  const jsType = typeof value;

  if (jsType === "object") {
    // Check for common BSON types not identified by native typeof
    if (value.constructor.name === "ObjectId") {
      return "ObjectId";
    }
    if (value instanceof Date) {
      return "Date";
    }
    // More complex types (Decimal128, etc.) would require specific checks.
    // We fall back to generic 'Object' for embedded documents/plain objects.
    return "Object";
  }

  // Handle primitives (string, number, boolean)
  return jsType;
}

/**
 * Next.js API route to fetch a summary of the MongoDB database schema.
 * It connects to the specified database, lists all collections, and samples
 * documents to infer the field names and their associated types.
 */
export async function POST(req) {
  let client;
  try {
    const { connectionURL, dbName } = await req.json();

    if (!connectionURL || !dbName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    client = new MongoClient(connectionURL);
    await client.connect();

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    const schemaSummary = {};
    const sampleLimit = 20; // Increased sample size for better coverage

    // Loop through collections and sample documents
    for (const col of collections) {
      const collection = db.collection(col.name);

      try {
        // Use $sample in aggregation for potentially more efficient random sampling
        const docs = await collection
          .aggregate([{ $sample: { size: sampleLimit } }])
          .toArray();

        if (docs.length === 0) {
          schemaSummary[col.name] = { message: "No documents found" };
          continue;
        }

        // Infer field names and types using the BSON-aware helper
        const fieldSummary = {};
        for (const doc of docs) {
          for (const key in doc) {
            const type = getBSONType(doc[key]);
            fieldSummary[key] = fieldSummary[key] || new Set();
            fieldSummary[key].add(type);
          }
        }

        // Convert sets to arrays
        schemaSummary[col.name] = {};
        for (const [field, types] of Object.entries(fieldSummary)) {
          schemaSummary[col.name][field] = Array.from(types);
        }
      } catch (err) {
        // Handle cases where collection access is denied (e.g., lack of read permission)
        schemaSummary[col.name] = {
          error: `Permission denied or collection error: ${err.message}`,
        };
        console.warn(
          `Skipping collection ${col.name} due to error: ${err.message}`
        );
      }
    }

    return NextResponse.json({ schema: schemaSummary }, { status: 200 });
  } catch (err) {
    console.error("Schema fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    // Ensure the client is closed reliably regardless of success or failure
    if (client) {
      await client.close().catch(console.error);
    }
  }
}
