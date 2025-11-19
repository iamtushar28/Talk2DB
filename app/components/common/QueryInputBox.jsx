import React from 'react';
import Link from 'next/link';
import { LuDatabase } from "react-icons/lu";
import PromptGeneratorForm from './PromptGeneratorForm';
import DbSelector from './DbSelector';

/**
 * Component: QueryInputBox
 * Purpose: Displays the query input area, handles database connection state, 
 * and provides access to the prompt generator form.
 */
const QueryInputBox = ({
    user,
    isConnected,
    isLoadingConnection,
    isLoadingUser
}) => {

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>
            {/* Section Title */}
            <h4 className='font-semibold'>Instruction</h4>

            {/* Prompt Generator Form 
                Allows users to input a natural language prompt 
                and generate a corresponding database query. */}
            <PromptGeneratorForm
                user={user}
            />

            {/* Database Connection Status Section */}
            <div className='flex gap-4 items-center'>
                <h2 className='font-semibold'>Connection:</h2>

                {user && isConnected ? (
                    // Display current connected database (via dropdown selector)
                    <DbSelector />
                ) : (
                    // Show "Connect DB" button if no active connection
                    <Link
                        href="/connect"
                        className='px-4 py-2 text-sm font-semibold text-black bg-white border border-zinc-300 hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300'
                    >
                        {(isLoadingUser || isLoadingConnection) ? 'Loading...' : 'Connect DB'}
                        <LuDatabase />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default QueryInputBox;
