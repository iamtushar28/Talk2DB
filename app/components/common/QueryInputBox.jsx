import React from 'react';
import Link from 'next/link';
import { LuDatabase } from "react-icons/lu";
import { SiMongodb } from "react-icons/si";
import PromptGeneratorForm from './PromptGeneratorForm';

const QueryInputBox = ({
    user,
    setGeneratedQuery,
    isConnected,
    isLoadingConnection,
    dbConnectionData,
    dbName
}) => {
    // Show loading skeleton
    if (isLoadingConnection) {
        return (
            <div className='w-full md:w-[48%] flex flex-col gap-4'>
                <h4 className='font-semibold'>Instruction</h4>
                <div className='w-full h-32 bg-zinc-200 rounded-lg animate-pulse'></div>
                <div className='w-32 h-10 bg-zinc-200 rounded-lg animate-pulse'></div>
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
                dbConnectionData={dbConnectionData}
            />

            {/* Connection Status */}
            <div className='flex gap-4 items-center'>
                <h2 className='font-semibold'>Connection:</h2>

                {user && isConnected ? (
                    // ✅ Connected State
                    <div className='px-4 py-2 text-sm font-semibold text-black rounded-lg flex gap-1 items-center border border-gray-200'>
                        <SiMongodb className="text-xl text-green-600" />
                        MongoDB: {dbName}
                    </div>
                ) : (
                    // Not Connected — Show Connect DB Button
                    <Link
                        href="/connect"
                        className='px-4 py-2 text-sm font-semibold text-black bg-white border border-zinc-300 hover:bg-zinc-100 rounded-lg flex gap-2 items-center cursor-pointer transition-all duration-300'
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
