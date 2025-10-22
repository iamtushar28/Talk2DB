'use client';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import QueryInputBox from './QueryInputBox';
import GeneratedResponse from './GeneratedResponse';

const Hero = () => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Multiple MongoDB connections
    const [dbConnections, setDbConnections] = useState([]);
    const [selectedDb, setSelectedDb] = useState(null);
    const [isLoadingConnection, setIsLoadingConnection] = useState(true);

    // Query result
    const [generatedQuery, setGeneratedQuery] = useState('');

    // ✅ Watch Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoadingUser(false);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Fetch all DB connections for the logged-in user
    useEffect(() => {
        const fetchConnections = async () => {
            if (!user) {
                setIsLoadingConnection(false);
                return;
            }

            try {
                const connectionsRef = collection(db, 'mongodb_connections');
                const q = query(connectionsRef, where('userId', '==', user.uid));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDbConnections(data);

                // Auto-select first DB if available
                if (data.length > 0) setSelectedDb(data[0]);
            } catch (error) {
                console.error('Error fetching MongoDB connections:', error);
            } finally {
                setIsLoadingConnection(false);
            }
        };

        fetchConnections();
    }, [user]);

    const handleSetQuery = (query) => {
        setGeneratedQuery(query);
    };

    const handleDbSelect = (dbId) => {
        const selected = dbConnections.find(conn => conn.id === dbId);
        setSelectedDb(selected);
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
                    isConnected={!!selectedDb}
                    isLoadingConnection={isLoadingConnection}
                    dbConnections={dbConnections}   // pass all
                    selectedDb={selectedDb}          // pass selected
                    setSelectedDb={setSelectedDb}    // allow child to update
                    setGeneratedQuery={handleSetQuery}
                />


                {/* Generated Query Display */}
                <GeneratedResponse
                    user={user}
                    query={generatedQuery}
                    dbConnectionData={selectedDb}
                    isConnected={!!selectedDb}
                />
            </div>
        </div>
    );
};

export default Hero;
