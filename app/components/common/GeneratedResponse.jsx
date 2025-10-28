import React, { useState } from 'react';
import { IoPlayOutline } from "react-icons/io5";
import { PiSpinnerBold } from "react-icons/pi";
import { BiShowAlt } from "react-icons/bi";
import Result from './Result';
import ErrorMessage from '../ui/ErrorMessage';
import FormattedQueryViewer from './FormattedQueryViewer';

/**
 * Component: GeneratedResponse
 * Purpose: Displays the generated query, allows execution,
 * and shows the query result or error.
 */
const GeneratedResponse = ({ query, dbConnectionData }) => {
    // Local state management
    const [result, setResult] = useState(null);     // Query execution result
    const [isRunning, setIsRunning] = useState(false); // Loader state while running query
    const [error, setError] = useState(null);       // Error message if query fails
    const [showResult, setShowResult] = useState(false); // Controls visibility of result modal
    const hasQuery = query && query.trim().length > 0; // Validate non-empty query

    /**
     * Executes the generated query against backend API
     */
    const handleRunQuery = async () => {
        if (!hasQuery || !dbConnectionData) return;

        setIsRunning(true);
        setError(null);
        setResult(null);

        try {
            // Construct route dynamically
            const dbType = dbConnectionData.dbType || 'mongodb'; // fallback
            const route = `/api/${dbType}/execute-query`;

            const res = await fetch(route, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    dbConnectionData,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to execute query.');

            setResult(data.result);
            setShowResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-1'>
            {/* ===== Header Actions ===== */}
            <div className='w-full flex justify-between items-center'>
                <h2 className='font-semibold text-sm'>Output</h2>

                <div className='flex gap-1'>
                    {/* Run Query Button */}
                    <button
                        onClick={handleRunQuery}
                        disabled={!hasQuery || !dbConnectionData}
                        className={`px-3 md:px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-white ${isRunning ? 'bg-zinc-100' : ''}`}
                    >
                        {isRunning ? (
                            <>
                                Running
                                <PiSpinnerBold className='text-xl animate-spin' />
                            </>
                        ) : (
                            <>
                                Run Query
                                <IoPlayOutline className='text-lg' />
                            </>
                        )}
                    </button>

                    {/* Show Result Button */}
                    <button
                        onClick={() => setShowResult(true)}
                        disabled={!result}
                        className='px-3 md:px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-white'
                    >
                        Show Result
                        <BiShowAlt className='text-lg' />
                    </button>
                </div>
            </div>

            {/* ===== Query Display ===== */}
            {hasQuery ? (
                // Display generated query with syntax highlighting
                <FormattedQueryViewer dbType={dbConnectionData.dbType} query={query} />
            ) : (
                // Placeholder text when no query is generated
                <div className='w-full p-4 bg-gray-50 rounded-full'>
                    <p className='text-zinc-500'>Generated query appears here...</p>
                </div>
            )}

            {/* ===== Error Message ===== */}
            {error && <ErrorMessage errorMessage={error} />}

            {/* ===== Result Modal ===== */}
            {(result && showResult) && (
                <Result
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </div>
    );
};

export default GeneratedResponse;
