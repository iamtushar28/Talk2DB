import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    const { query, dbConnectionData } = await req.json();

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

    // ✅ Only allow "db.collection.find(...)" or "db.collection.aggregate(...)"
    const readOps = [
      /db\.[a-zA-Z0-9_]+\.find\s*\(/,
      /db\.[a-zA-Z0-9_]+\.aggregate\s*\(/,
    ];
    if (!readOps.some((regex) => regex.test(query))) {
      return NextResponse.json(
        { error: "Only read operations (find, aggregate) are allowed." },
        { status: 400 }
      );
    }

    // Convert ISODate(...) to new Date(...) automatically
    const safeQuery = query.replace(/ISODate\(([^)]+)\)/g, "new Date($1)");

    const client = new MongoClient(connectionURL);
    await client.connect();
    const db = client.db(dbName);

    let result;

    // --- Handle find() ---
    const findMatch = safeQuery.match(/db\.([a-zA-Z0-9_]+)\.find\(([\s\S]*)\)/);
    if (findMatch) {
      const collection = findMatch[1];
      let args;
      try {
        args = eval(`[${findMatch[2]}]`); // wrap in array for destructuring
      } catch {
        return NextResponse.json(
          { error: "Invalid find() query." },
          { status: 400 }
        );
      }
      const [filter = {}, projection = {}] = args;
      result = await db
        .collection(collection)
        .find(filter, { projection })
        .toArray();
    }

    // --- Handle aggregate() ---
    const aggMatch = safeQuery.match(
      /db\.([a-zA-Z0-9_]+)\.aggregate\(([\s\S]*)\)/
    );
    if (aggMatch) {
      const collection = aggMatch[1];
      let pipeline;
      try {
        pipeline = eval(aggMatch[2]);
      } catch {
        return NextResponse.json(
          { error: "Invalid aggregation pipeline." },
          { status: 400 }
        );
      }
      result = await db.collection(collection).aggregate(pipeline).toArray();
    }

    await client.close();

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Unsupported query format. Only find() or aggregate() allowed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("MongoDB execution error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
