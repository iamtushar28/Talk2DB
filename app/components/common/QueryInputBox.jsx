import React from 'react';
import Link from 'next/link';
import { LuDatabase } from "react-icons/lu";
import PromptGeneratorForm from './PromptGeneratorForm';
import MongoDbSelector from './MongoDbSelector';

const QueryInputBox = ({
    user,
    setGeneratedQuery,
    selectedDb,
    isConnected,
    isLoadingConnection
}) => {
    // Show loading skeleton
    if (isLoadingConnection) {
        return (
            <div className='w-full md:w-[48%] flex flex-col gap-4'>
                <h4 className='font-semibold'>Instruction</h4>
                <div className='w-full h-32 bg-zinc-200 rounded-3xl animate-pulse'></div>
                <div className='w-32 h-10 bg-zinc-200 rounded-full animate-pulse'></div>
                <div className='flex gap-4 items-center'>
                    <h2 className='font-semibold'>Connection:</h2>
                    <div className='w-32 h-10 bg-zinc-200 rounded-full animate-pulse'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>
            {/* Title */}
            <h4 className='font-semibold'>Instruction</h4>

            {/* Prompt Form */}
            <PromptGeneratorForm
                isConnected={isConnected}
                setGeneratedQuery={setGeneratedQuery}
                user={user}
                dbConnectionData={selectedDb} // ✅ use selectedDb here
            />

            {/* Connection Status */}
            <div className='flex gap-4 items-center'>
                <h2 className='font-semibold'>Connection:</h2>

                {user && isConnected ? (
                    // ✅ Connected State
                    <MongoDbSelector />
                ) : (
                    // Not Connected — Show Connect DB Button
                    <Link
                        href="/connect"
                        className='px-4 py-2 text-sm font-semibold text-black bg-white border border-zinc-300 hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300'
                    >
                        Connect DB
                        <LuDatabase />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default QueryInputBox;
