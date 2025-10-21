import React from 'react';
import LightGrayButton from '../ui/LightGrayButton';
import { IoPlayOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

// 👈 Import the highlighter components
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 👈 Import a dark, VS Code-like style
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const GeneratedResponse = ({ query }) => {

    // Determine the language for highlighting (MQL is JavaScript/JSON)
    const language = 'javascript';

    // Determine if the query is valid/non-empty
    const hasQuery = query && query.trim().length > 0;

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>

            {/* actions */}
            <div className='w-full flex justify-end'>
                {/* run query (Disabled if no query) */}
                <LightGrayButton
                    title={'Run Query'}
                    icon={<IoPlayOutline />}
                    disabled={!hasQuery}
                />

                {/* edit query (Disabled if no query) */}
                <LightGrayButton
                    title={'Edit'}
                    icon={<BiEditAlt />}
                    disabled={!hasQuery}
                />
            </div>

            {/* response box */}
            {hasQuery ? (
                // RENDER SYNTAX HIGHLIGHTER
                <SyntaxHighlighter
                    language={language}
                    style={dracula} // Apply the VS Code-like theme
                    wrapLines={true}
                    customStyle={{
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        overflowX: 'auto', // Ensure horizontal scrolling for long lines
                    }}
                >
                    {query}
                </SyntaxHighlighter>
            ) : (
                // Display placeholder when no query is available
                <div className='w-full p-4 bg-gray-50 rounded-lg'>
                    <p className='text-zinc-500'>Generated query appears here...</p>
                </div>
            )}


        </div >
    );
}

export default GeneratedResponse;