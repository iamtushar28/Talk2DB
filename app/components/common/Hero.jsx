'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import QueryInputBox from './QueryInputBox';
import GeneratedResponse from './GeneratedResponse';

const Hero = () => {
    // State for Firebase Auth (already existing)
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // NEW STATE: To hold the generated query string
    const [generatedQuery, setGeneratedQuery] = useState('');

    // Effect to check and maintain the Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoadingUser(false);
        });
        return () => unsubscribe();
    }, []);

    // Helper function to update the query state from children
    const handleSetQuery = (query) => {
        setGeneratedQuery(query);
    };

    return (
        <div className='w-full h-fit py-16 md:py-24 flex flex-col gap-8 md:gap-2 justify-center items-center'>

            {/* title */}
            <div className='flex flex-col justify-center items-center'>
                <h4 className='text-2xl'>
                    Generate SQL Query
                </h4>
                <h4 className='text-lg text-zinc-600'>
                    Turn everyday language into queries.
                </h4>
                <button className='ml-1 text-violet-500 hover:underline transition-all duration-300 cursor-pointer'>Quick guide.</button>
            </div>

            {/* query input & result section */}
            <div className='w-full px-4 flex flex-col md:flex-row justify-center gap-12 md:gap-6'>

                {/* QueryInputBox now receives the setter function */}
                <QueryInputBox
                    user={user}
                    setGeneratedQuery={handleSetQuery} // PASS SETTER
                />

                {/* GeneratedResponse now receives the query data */}
                <GeneratedResponse
                    user={user}
                    query={generatedQuery} // PASS DATA
                />

            </div>
        </div>
    );
}

export default Hero;