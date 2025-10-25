import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { PiSpinnerBold } from "react-icons/pi";
import { BsLightningCharge } from "react-icons/bs";

/**
 * Component: PromptGeneratorForm
 * Purpose: Accepts natural language input and generates an optimized DB query using the selected database schema and type.
 */
const PromptGeneratorForm = ({ setGeneratedQuery, user }) => {
    // Access selected DB connection details from Redux store
    const { selectedDb } = useSelector((state) => state.dbConnections);

    // Local component state
    const [userQuery, setUserQuery] = useState('');     // User-entered natural language prompt
    const [isGenerating, setIsGenerating] = useState(false); // Loading state for query generation

    /**
     * Handles query generation via API call.
     * Validates user and DB connection before sending prompt to the backend.
     */
    const handleGenerateQuery = async () => {
        if (!selectedDb || !user) {
            toast.error("Database is not connected.");
            return;
        }

        // Begin loading and reset previous generated query
        setIsGenerating(true);
        setGeneratedQuery('');

        // Extract schema and type from selected database
        const dbSchema = selectedDb?.dbSchema || '';
        const dbType = selectedDb?.dbType || '';

        try {
            // API call to backend route for query generation
            const response = await fetch('/api/gemini/generate-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userQuery,
                    dbType,
                    dbSchema,
                }),
            });

            const data = await response.json();

            // Handle successful response
            if (response.ok) {
                setGeneratedQuery(data.query);
                toast.success('Query generated successfully!');
            } else {
                // Handle server-side error response
                toast.error(data.error || 'Failed to generate query.');
                setGeneratedQuery(`Error: ${data.error || 'Check server logs.'}`);
            }
        } catch (error) {
            // Handle unexpected network or parsing errors
            console.error(error);
            toast.error('An unexpected error occurred.');
            setGeneratedQuery('Error connecting to the generation service.');
        } finally {
            // Reset loading state
            setIsGenerating(false);
        }
    };

    return (
        <>
            {/* Toast notification container */}
            <Toaster />

            {/* Input area for user prompt */}
            <textarea
                cols={70}
                rows={4}
                placeholder="Show total sale of this month."
                className='p-4 border border-zinc-300 hover:ring-2 hover:ring-violet-500 outline-none rounded-3xl transition-all duration-300 resize-none'
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={isGenerating}
            />

            {/* Action buttons section */}
            <div className='flex gap-4 mt-2'>
                {/* Generate Query Button */}
                <button
                    onClick={handleGenerateQuery}
                    disabled={isGenerating || !userQuery.trim()}
                    className='px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-3xl disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 items-center cursor-pointer transition-all duration-300'
                >
                    {isGenerating ? (
                        <>
                            Generating
                            <PiSpinnerBold className='text-xl animate-spin' />
                        </>
                    ) : (
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
