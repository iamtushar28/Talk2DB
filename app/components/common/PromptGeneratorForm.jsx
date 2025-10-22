import React, { useState } from 'react';
import { BsLightningCharge } from "react-icons/bs";
import { toast, Toaster } from 'react-hot-toast';
import { PiSpinnerBold } from "react-icons/pi";

// This component receives the connection status and the query setter function
const PromptGeneratorForm = ({ isConnected, setGeneratedQuery, user, dbConnectionData }) => {
    const [userQuery, setUserQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateQuery = async () => {

        if (!isConnected || !user) {
            toast.error("Database is not connected.");
            return;
        }

        setIsGenerating(true);
        setGeneratedQuery(''); // Clear previous query while generating

        // getting dbName
        const dbSchema = dbConnectionData?.dbSchema || '';

        try {
            const response = await fetch('/api/gemini/generate-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userQuery,
                    dbType: 'mongodb',
                    dbSchema: dbSchema,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update the parent state with the generated query
                setGeneratedQuery(data.query);
                toast.success('Query generated successfully!');
            } else {
                toast.error(data.error || 'Failed to generate query.');
                setGeneratedQuery(`Error: ${data.error || 'Check server logs.'}`);
            }
        } catch (error) {
            console.error('API call error:', error);
            toast.error('An unexpected error occurred.');
            setGeneratedQuery('Error connecting to the generation service.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            {/* react toast notification */}
            <Toaster />
            {/* Query Input Box */}
            <textarea
                name="userQuery"
                id="userQuery"
                cols={70}
                rows={4}
                placeholder='Show total sale of this month.'
                className='p-3 border border-zinc-300 hover:ring-2 hover:ring-violet-500 outline-none rounded-lg transition-all duration-300 resize-none'
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={isGenerating}
            ></textarea>

            <div className='flex gap-4'>
                {/* Generate Query Button */}
                <button
                    onClick={handleGenerateQuery}
                    disabled={isGenerating || !userQuery.trim()}
                    className='px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 items-center cursor-pointer transition-all duration-300'
                >
                    {isGenerating ?
                        <>
                            Generating
                            <PiSpinnerBold className='text-xl animate-spin' />
                        </>
                        :
                        <>
                            Generate Query
                            <BsLightningCharge />
                        </>
                    }

                </button>
            </div>
        </>
    );
};

export default PromptGeneratorForm;