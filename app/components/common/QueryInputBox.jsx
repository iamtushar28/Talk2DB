// components/QueryInputBox.jsx (Revised)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuDatabase } from "react-icons/lu";
import { SiMongodb } from "react-icons/si"; // Used for MongoDB icon
import PromptGeneratorForm from './PromptGeneratorForm'; // 👈 Import new component

// Import Firestore dependencies
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Accept the 'user' object and the setter function as props
const QueryInputBox = ({ user, setGeneratedQuery }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [dbName, setDbName] = useState('...');
    const [dbConnectionData, setDbConnectionData] = useState(null); // To pass connection details to the prompt form
    const [isLoadingConnection, setIsLoadingConnection] = useState(true);

    // Effect to fetch connection status from Firestore
    useEffect(() => {
        const fetchConnectionStatus = async () => {
            if (!user) {
                setIsLoadingConnection(false);
                return;
            }

            const userId = user.uid;

            try {
                const connectionsRef = collection(db, 'mongodb_connections');
                const q = query(connectionsRef, where('userId', '==', userId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setIsConnected(true);
                    setDbName(data.dbName || 'MongoDB');
                    setDbConnectionData(data); // Save all connection data
                } else {
                    setIsConnected(false);
                    setDbName('...');
                    setDbConnectionData(null);
                }
            } catch (error) {
                console.error("Error fetching connection status:", error);
            } finally {
                setIsLoadingConnection(false);
            }
        };

        fetchConnectionStatus();
    }, [user]);

    // Show loading state while checking the DB status
    if (isLoadingConnection) {
        return (
            // loading skelaton
            <div className='w-full md:w-[48%] flex flex-col gap-4'>
                <h4 className='font-semibold'>Instruction</h4>
                <div className='w-full h-32 bg-zinc-200 rounded-lg animate-pulse'></div>
                <div className='w-32 h-10 bg-zinc-200 rounded-lg animate-pulse'></div>
            </div>
        );
    }

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>
            {/* title */}
            <h4 className='font-semibold'>Instruction</h4>

            {/* Prompt Generator Form component handles the input and button */}
            <PromptGeneratorForm
                isConnected={isConnected}
                setGeneratedQuery={setGeneratedQuery}
                user={user}
                dbConnectionData={dbConnectionData}
            />

            {/* Connection Status / Connect DB button */}
            <div className='flex gap-4 items-center'>
                <h2 className='font-semibold'>Connection : </h2>
                {user && isConnected ? (
                    // Display Connected Status
                    <div className='px-4 py-2 text-sm font-semibold text-black rounded-lg flex gap-1 items-center border border-gray-200'>
                        <SiMongodb className="text-xl text-green-600" />
                        MongoDB: {dbName}
                    </div>
                ) : (
                    // Display Connect DB Button
                    <Link
                        href={'/connect'}
                        className='px-4 py-2 text-sm font-semibold text-black bg-white border border-zinc-300 hover:bg-zinc-100 rounded-lg flex gap-2 items-center cursor-pointer transition-all duration-300'
                    >
                        Connect DB
                        <LuDatabase />
                    </Link>
                )}
            </div>
        </div>
    );
}

export default QueryInputBox;