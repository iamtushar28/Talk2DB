import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { dbName, connectionURL } = await req.json();

    // Validate input
    if (!dbName || !connectionURL) {
      return new Response(
        JSON.stringify({ error: "dbName and connectionURL are required." }),
        { status: 400 }
      );
    }

    // Create MySQL connection
    const connection = await mysql.createConnection(connectionURL);

    try {
      // Fetch tables
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?",
        [dbName ?? null] // Ensure no undefined, use null if undefined
      );

      // Fetch columns for each table
      const schema = {};
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
        const [columns] = await connection.execute(
          "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT FROM information_schema.columns WHERE table_schema = ? AND table_name = ?",
          [dbName ?? null, tableName ?? null]
        );
        schema[tableName] = columns;
      }

      await connection.end();

      return new Response(JSON.stringify({ schema }), { status: 200 });
    } catch (queryError) {
      console.error("Query error:", queryError);
      await connection.end();
      return new Response(
        JSON.stringify({ error: "Failed to fetch schema." }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request error:", error);
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
    });
  }
}
