// app/api/get-schema/route.js
import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    const { connectionURL, dbName } = await req.json();

    if (!connectionURL || !dbName) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const client = new MongoClient(connectionURL);
    await client.connect();

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    const schemaSummary = {};

    // Loop through collections and sample a few documents
    for (const col of collections) {
      const collection = db.collection(col.name);
      const docs = await collection.find({}).limit(10).toArray();

      if (docs.length === 0) {
        schemaSummary[col.name] = "No documents found";
        continue;
      }

      // Infer field names and types
      const fieldSummary = {};
      for (const doc of docs) {
        for (const key in doc) {
          const type = Array.isArray(doc[key]) ? "Array" : typeof doc[key];
          fieldSummary[key] = fieldSummary[key] || new Set();
          fieldSummary[key].add(type);
        }
      }

      // Convert sets to arrays
      schemaSummary[col.name] = {};
      for (const [field, types] of Object.entries(fieldSummary)) {
        schemaSummary[col.name][field] = Array.from(types);
      }
    }

    await client.close();

    return new Response(JSON.stringify({ schema: schemaSummary }), {
      status: 200,
    });
  } catch (err) {
    console.error("Schema fetch error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
