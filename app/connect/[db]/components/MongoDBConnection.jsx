'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

const MongoDBConnection = () => {
    // State to hold the logged-in user's ID
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Get the current user ID using Firebase Auth
    useEffect(() => {
        // Set up a listener to get the current authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, set their UID
                setUserId(user.uid);
            } else {
                // User is signed out
                setUserId(null);
                toast.error("You must be logged in to save a connection.");
            }
            setIsLoadingUser(false);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm({
        defaultValues: {
            dbName: '',
            connectionURL: ''
        },
        mode: 'onBlur',
    });

    // Form submission handler
    const onSubmit = async (data) => {
        if (!userId) {
            toast.error("Authentication error: User ID is missing.");
            return;
        }

        try {
            // Save data to Firestore
            const docRef = await addDoc(collection(db, 'mongodb_connections'), {
                dbName: data.dbName,
                connectionURL: data.connectionURL, // Stored as plain text
                // SAVE THE LOGGED-IN USER ID
                userId: userId,
                createdAt: new Date(),
            });

            toast.success(`Connection saved successfully!`);

            // Reset the form fields to their default values (empty strings)
            reset();

        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to save connection to Firebase.");
        }
    };

    // Validation rules
    const nameValidation = {
        required: 'Database name is required',
        minLength: { value: 3, message: 'Must be at least 3 characters' }
    };

    const urlValidation = {
        required: 'Connection URL is required',
        pattern: {
            value: /^mongodb(\+srv)?:\/\/.+/,
            message: 'Invalid MongoDB connection URL format',
        },
    };

    // Show a loading state while fetching user
    if (isLoadingUser) {
        return (
            <div className='w-full mt-4 text-center font-semibold'>
                Loading...
            </div>
        );
    }

    // Disable the form and show a message if the user is not logged in
    if (!userId) {
        return (
            <div className='w-full mt-4 text-center font-semibold'>
                <h2 className='text-3xl font-semibold'>Sign In Required!</h2>
                <Link href={'/signin'} className='mt-2 text-violet-500 underline'>
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* react tost notifications */}
            <Toaster />

            <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                {/* db name */}
                <div>
                    <label htmlFor="dbName" className='font-semibold'>Name</label>
                    <input
                        type="text"
                        id='dbName'
                        placeholder='Database Name e.g. Acme DB'
                        {...register('dbName', nameValidation)}
                        className={`w-full h-12 mt-2 p-3 border rounded-lg outline-none ring-violet-500 transition-all duration-300 ${errors.dbName ? 'border-red-500 hover:ring-0' : 'border-zinc-300 hover:ring-2'}`}
                    />
                    {errors.dbName && (
                        <p className="text-red-500 text-sm mt-1">{errors.dbName.message}</p>
                    )}
                </div>

                {/* connection url */}
                <div>
                    <label htmlFor="connectionURL" className='font-semibold'>Connection URL</label>
                    <textarea
                        id="connectionURL"
                        placeholder='Connection URL e.g. mongodb://username:password@host:port/database?authSource=admin'
                        {...register('connectionURL', urlValidation)}
                        className={`w-full h-24 mt-2 p-3 border rounded-lg outline-none ring-violet-500 transition-all duration-300 resize-none ${errors.connectionURL ? 'border-red-500 hover:ring-0' : 'border-zinc-300 hover:ring-2'}`}
                    >
                    </textarea>
                    {errors.connectionURL && (
                        <p className="text-red-500 text-sm mt-1">{errors.connectionURL.message}</p>
                    )}
                </div>

                <div className='w-full flex justify-end'>
                    <button
                        type="submit"
                        className={`mt-2 py-2 px-4 w-fit text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer bg-violet-600 hover:bg-violet-700 ${isSubmitting || !isValid || !userId
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                            }`}
                        disabled={isSubmitting || !isValid || !userId}
                    >
                        {isSubmitting ? 'Connecting...' : 'Connect'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default MongoDBConnection;