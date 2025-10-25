import mysql from "mysql2/promise";

/**
 * POST /api/mysql/execute-query
 * Body: { query: string, dbConnectionData: { connectionURL, dbName } }
 * Executes a read-only query on MySQL.
 */
export async function POST(req) {
  try {
    const { query, dbConnectionData } = await req.json();

    if (!query || !dbConnectionData) {
      return new Response(
        JSON.stringify({ error: "Missing query or database connection data." }),
        { status: 400 }
      );
    }

    const { connectionURL, dbName } = dbConnectionData;
    if (!connectionURL || !dbName) {
      return new Response(
        JSON.stringify({ error: "Missing connection URL or database name." }),
        { status: 400 }
      );
    }

    // Ensure only SELECT/read queries are allowed
    const queryTrimmed = query.trim().toLowerCase();
    if (!queryTrimmed.startsWith("select")) {
      return new Response(
        JSON.stringify({ error: "Only read (SELECT) queries are allowed." }),
        { status: 403 }
      );
    }

    // Parse MySQL connection URL: mysql://user:pass@host:port/db
    const url = new URL(connectionURL);
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password || "",
      database: dbName,
    };

    // Connect to MySQL
    const connection = await mysql.createConnection(config);

    // Execute query
    const [rows] = await connection.execute(query);

    await connection.end();

    return new Response(JSON.stringify({ result: rows }), { status: 200 });
  } catch (error) {
    console.error("MySQL Execute Query Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
