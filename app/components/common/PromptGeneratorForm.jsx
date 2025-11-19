import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { PiSpinnerBold } from "react-icons/pi";
import { BsLightningCharge } from "react-icons/bs";
import { generateQuery } from "@/redux-store/querySlice";

const PromptGeneratorForm = ({ user }) => {
    const dispatch = useDispatch();

    // Global state: selected database connection + query loading state
    const { selectedDb } = useSelector((state) => state.dbConnections);
    const { loading } = useSelector((state) => state.query);

    // Local state for user's query prompt
    const [userQuery, setUserQuery] = useState("");

    // Trigger backend query generation through Redux thunk
    const handleGenerateQuery = async () => {
        // Ensure user is authenticated & DB is connected
        if (!selectedDb || !user) {
            toast.error("Database is not connected.");
            return;
        }

        const { dbSchema, dbType } = selectedDb;

        // Dispatch the async thunk
        dispatch(generateQuery({ prompt: userQuery, dbType, dbSchema }))
            .unwrap()
            .then(() => toast.success("Query generated!"))
            .catch((err) => toast.error(err));
    };

    return (
        <>
            <Toaster />

            {/* User input prompt */}
            <textarea
                cols={70}
                rows={4}
                placeholder="Show total sale of this month."
                className="p-4 border border-zinc-300 hover:ring-2 hover:ring-violet-500 outline-none rounded-3xl transition-all duration-300 resize-none"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={loading} // Disabled while generating
            />

            <div className="flex gap-4 mt-2">
                {/* Generate Query Button */}
                <button
                    onClick={handleGenerateQuery}
                    disabled={loading || !userQuery.trim()} // Prevent empty or duplicate submissions
                    className="px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-3xl disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 items-center transition-all duration-300"
                >
                    {loading ? (
                        // Loading state UI
                        <>
                            Generating
                            <PiSpinnerBold className="text-xl animate-spin" />
                        </>
                    ) : (
                        // Default idle UI
                        <>
                            Generate Query
                            <BsLightningCharge />
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

export default PromptGeneratorForm;
