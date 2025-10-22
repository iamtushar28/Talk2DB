'use client';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import QueryInputBox from './QueryInputBox';
import GeneratedResponse from './GeneratedResponse';

const Hero = () => {
    // Auth state
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // NEW STATE: MongoDB connection data
    const [dbConnectionData, setDbConnectionData] = useState(null);
    const [isLoadingConnection, setIsLoadingConnection] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [dbName, setDbName] = useState('...');

    // Query result
    const [generatedQuery, setGeneratedQuery] = useState('');

    // Watch auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoadingUser(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch DB connection once user is known
    useEffect(() => {
        const fetchConnectionStatus = async () => {
            if (!user) {
                setIsLoadingConnection(false);
                return;
            }

            try {
                const connectionsRef = collection(db, 'mongodb_connections');
                const q = query(connectionsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setIsConnected(true);
                    setDbConnectionData(data);
                    setDbName(data.dbName || 'MongoDB');
                } else {
                    setIsConnected(false);
                    setDbConnectionData(null);
                    setDbName('...');
                }
            } catch (error) {
                console.error('Error fetching connection:', error);
            } finally {
                setIsLoadingConnection(false);
            }
        };

        fetchConnectionStatus();
    }, [user]);

    const handleSetQuery = (query) => {
        setGeneratedQuery(query);
    };

    return (
        <div className="w-full h-fit py-16 flex flex-col gap-10 justify-center items-center">
            {/* title */}
            <div className="flex flex-col justify-center items-center">
                <h4 className="text-2xl">Generate SQL Query</h4>
                <h4 className="text-lg text-zinc-600">
                    Turn everyday language into queries.
                </h4>
                <button className="ml-1 text-violet-500 hover:underline transition-all duration-300 cursor-pointer">
                    Quick guide.
                </button>
            </div>

            {/* query input & result section */}
            <div className="w-full px-4 flex flex-col md:flex-row justify-center gap-12 md:gap-6">
                {/* Query Input */}
                <QueryInputBox
                    user={user}
                    isConnected={isConnected}
                    isLoadingConnection={isLoadingConnection}
                    dbConnectionData={dbConnectionData}
                    dbName={dbName}
                    setGeneratedQuery={handleSetQuery}
                />

                {/* Generated Response */}
                <GeneratedResponse
                    user={user}
                    query={generatedQuery}
                    dbConnectionData={dbConnectionData}
                    isConnected={isConnected}
                />
            </div>
        </div>
    );
};

export default Hero;
