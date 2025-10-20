"use client";
import React, { useState } from "react";
import ConnectWithCredentialsForm from "./ConnectWithCredentialsForm";
import ConnectWithURLForm from "./ConnectWithURLForm";

const DatabaseConnectionMethod = () => {
    const [activeMethod, setActiveMethod] = useState("credentials");

    return (
        <div className="w-full flex flex-col gap-4">
            {/* connection method buttons */}
            <div className="w-[46%] flex gap-2">
                <button
                    onClick={() => setActiveMethod("credentials")}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${activeMethod === "credentials"
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Credentials
                </button>
                <button
                    onClick={() => setActiveMethod("url")}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${activeMethod === "url"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-gray-100 bg-gray-50"
                        }`}
                >
                    URL
                </button>
            </div>

            {/* conditionally render form */}
            {activeMethod === "credentials" ? (
                <ConnectWithCredentialsForm />
            ) : (
                <ConnectWithURLForm />
            )}
        </div>
    );
};

export default DatabaseConnectionMethod;
