import React from 'react';
import Link from 'next/link';
import { LuDatabase } from "react-icons/lu";
import { SiMongodb } from "react-icons/si";
import PromptGeneratorForm from './PromptGeneratorForm';

const QueryInputBox = ({
    user,
    setGeneratedQuery,
    dbConnections = [],
    selectedDb,
    setSelectedDb,
    isConnected,
    isLoadingConnection
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
                dbConnectionData={selectedDb} // ✅ use selectedDb here
            />

            {/* Connection Status */}
            <div className='flex gap-4 items-center'>
                <h2 className='font-semibold'>Connection:</h2>

                {user && isConnected ? (
                    // ✅ Connected State
                    <div className='flex items-center gap-2'>
                        <SiMongodb className="text-xl text-green-600" />

                        <select
                            value={selectedDb?.id || ''}
                            onChange={(e) => {
                                const selected = dbConnections.find(conn => conn.id === e.target.value);
                                setSelectedDb(selected);
                            }}
                            className='px-4 py-2 text-sm font-semibold text-black rounded-lg border border-gray-200 bg-white hover:bg-zinc-50 cursor-pointer transition-all duration-200'
                        >
                            {dbConnections.map((conn) => (
                                <option key={conn.id} value={conn.id}>
                                    {conn.dbName}
                                </option>
                            ))}
                        </select>
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
