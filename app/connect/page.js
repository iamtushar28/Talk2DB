import React from "react";
import SelectDBButton from "./components/SelectDBButton";
import Footer from "./components/Footer";

const page = () => {
  // db options
  const dbOptions = [
    {
      name: "mongodb",
      dbImage: "/images/db/mongodb.svg",
      title: "Connect to MongoDB",
    },
    {
      name: "mysql",
      dbImage: "/images/db/mysql.svg",
      title: "Connect to MySQL",
    },
  ];

  return (
    <div className="h-fit w-full px-2 py-20 flex gap-6 flex-col justify-center items-center">
      <div className="w-full md:w-[46%] flex flex-col justify-center items-center relative">
        {/* heading */}
        <h2 className="text-2xl">Connect to database</h2>
        <h4 className="text-lg text-gray-500 text-center">
          Connect to database to run AI-generated queries directly.
        </h4>
      </div>

      {/* db connect options */}
      {dbOptions.map((db, index) => (
        <SelectDBButton
          key={index}
          dbImage={db.dbImage}
          title={db.title}
          db={db.name}
        />
      ))}

      {/* footer */}
      <Footer />
    </div>
  );
};

export default page;
