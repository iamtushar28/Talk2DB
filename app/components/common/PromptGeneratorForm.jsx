import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { PiSpinnerBold } from "react-icons/pi";
import { BsLightningCharge } from "react-icons/bs";
import DbTypeSelector from './DbTypeSelector';

const PromptGeneratorForm = ({ setGeneratedQuery, user }) => {
    const { selectedDb, dbType } = useSelector((state) => state.dbConnections);
    const [userQuery, setUserQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateQuery = async () => {
        if (!selectedDb || !user) {
            toast.error("Database is not connected.");
            return;
        }

        setIsGenerating(true);
        setGeneratedQuery('');

        const dbSchema = selectedDb?.dbSchema || '';

        try {
            const response = await fetch('/api/gemini/generate-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userQuery,
                    dbType,   // dynamic dbType from Redux
                    dbSchema,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedQuery(data.query);
                toast.success('Query generated successfully!');
            } else {
                toast.error(data.error || 'Failed to generate query.');
                setGeneratedQuery(`Error: ${data.error || 'Check server logs.'}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred.');
            setGeneratedQuery('Error connecting to the generation service.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Toaster />
            <textarea
                cols={70} rows={4} placeholder="Show total sale of this month."
                className='p-4 border border-zinc-300 hover:ring-2 hover:ring-violet-500 outline-none rounded-3xl transition-all duration-300 resize-none'
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={isGenerating}
            />

            <div className='flex gap-4 mt-2'>
                {/* Generate Query Button */}
                <button
                    onClick={handleGenerateQuery}
                    disabled={isGenerating || !userQuery.trim()}
                    className='px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-3xl disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 items-center cursor-pointer transition-all duration-300'
                >
                    {isGenerating ?
                        <>Generating<PiSpinnerBold className='text-xl animate-spin' /></> :
                        <>Generate Query<BsLightningCharge /></>
                    }
                </button>

                {/* DB Type Selector */}
                <DbTypeSelector availableDbTypes={['mongodb', 'mysql']} />
            </div>
        </>
    );
};

export default PromptGeneratorForm;
