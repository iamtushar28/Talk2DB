import React, { useState } from 'react';
import { IoPlayOutline } from "react-icons/io5";
import { PiSpinnerBold } from "react-icons/pi";
import { BiShowAlt } from "react-icons/bi";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Result from './Result';
import ErrorMessage from '../ui/ErrorMessage';

const GeneratedResponse = ({ query, dbConnectionData }) => {
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const language = 'javascript';
    const hasQuery = query && query.trim().length > 0;

    // ✅ Handle query execution
    const handleRunQuery = async () => {
        if (!hasQuery || !dbConnectionData) return;

        setIsRunning(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/mongodb/execute-query', {
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
            {/* Actions */}
            <div className='w-full flex justify-between items-center'>
                <h2 className='font-semibold text-sm'>Output</h2>

                <div className='flex gap-1'>
                    {/* Run Query */}
                    <button
                        onClick={handleRunQuery}
                        disabled={!hasQuery || !dbConnectionData}
                        className={`px-2 md:px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-white ${isRunning ? 'bg-zinc-100' : ''}`}
                    >
                        {isRunning ?
                            <>
                                Running
                                <PiSpinnerBold className='text-xl animate-spin' />
                            </>
                            :
                            <>
                                Run Query
                                <IoPlayOutline className='text-lg' />
                            </>
                        }
                    </button>

                    <button
                        onClick={() => setShowResult(true)}
                        disabled={!result}
                        className='px-2 md:px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-white'
                    >
                        Show Result
                        <BiShowAlt className='text-lg' />
                    </button>

                </div>
            </div>

            {/* Syntax Highlighter */}
            {hasQuery ? (
                <SyntaxHighlighter
                    language={language}
                    style={dracula}
                    wrapLines={true}
                    customStyle={{
                        padding: '16px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        overflowX: 'auto',
                    }}
                >
                    {query}
                </SyntaxHighlighter>
            ) : (
                <div className='w-full p-4 bg-gray-50 rounded-full'>
                    <p className='text-zinc-500'>Generated query appears here...</p>
                </div>
            )}

            {/* <p>{error}</p> */}
            {error && <ErrorMessage errorMessage={error} />}

            {/* showing result modal for query execution output */}
            {(result && showResult) && <Result result={result} onClose={() => setShowResult(false)} />}
        </div>
    );
};

export default GeneratedResponse;
