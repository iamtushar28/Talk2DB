import DatabaseConnectionMethod from "./components/DatabaseConnectionMethod";
import MongoDBConnection from "./components/mongodb/MongoDBConnection";

// Mark the Page component as 'async'
export default async function Page({ params }) {
  // Await the params object before destructuring (Next.js requirement)
  const resolvedParams = await params;
  const { db } = resolvedParams; // get the dynamic route (e.g. 'mysql', 'mongodb')

  // Normalize for safety
  const dbName = db.toLowerCase();

  return (
    <div className="h-fit w-full px-2 py-20 flex justify-center items-center">
      <div className="w-full h-fit md:w-[46%] flex flex-col gap-6 justify-center items-center relative">
        {/* title */}
        <h1 className="text-2xl">
          Connecting to {db.charAt(0).toUpperCase() + db.slice(1)}
        </h1>

        {/* Conditionally render based on selected DB */}
        {dbName === "mysql" && <DatabaseConnectionMethod />}

        {dbName === "mongodb" && <MongoDBConnection />}
      </div>
    </div>
  );
}
