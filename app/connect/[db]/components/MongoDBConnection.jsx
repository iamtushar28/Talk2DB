'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

const MongoDBConnection = () => {
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [dbSchema, setDbSchema] = useState('');
    const [isFetchingSchema, setIsFetchingSchema] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                toast.error("You must be logged in to save a connection.");
            }
            setIsLoadingUser(false);
        });
        return () => unsubscribe();
    }, []);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm({
        defaultValues: { dbName: '', connectionURL: '' },
        mode: 'onBlur',
    });

    // 🔹 Fetch schema from server
    const fetchSchema = async () => {
        const { dbName, connectionURL } = getValues();

        if (!dbName || !connectionURL) {
            toast.error("Please fill DB name and connection URL first.");
            return;
        }

        setIsFetchingSchema(true);

        try {
            const res = await fetch('/api/mongodb/get-schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dbName, connectionURL }),
            });

            const data = await res.json();
            if (res.ok) {
                setDbSchema(JSON.stringify(data.schema, null, 2));
                toast.success("Schema fetched successfully!");
            } else {
                toast.error(data.error || "Failed to fetch schema.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching schema.");
        } finally {
            setIsFetchingSchema(false);
        }
    };

    // 🔹 Submit form
    const onSubmit = async (data) => {
        if (!userId) {
            toast.error("Authentication error: User ID is missing.");
            return;
        }

        try {
            await addDoc(collection(db, 'mongodb_connections'), {
                dbName: data.dbName,
                connectionURL: data.connectionURL,
                dbSchema: dbSchema || "Schema not fetched",
                userId: userId,
                createdAt: new Date(),
            });

            toast.success(`Connection saved successfully!`);
            reset();
            setDbSchema('');

        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to save connection to Firebase.");
        }
    };

    if (isLoadingUser) {
        return <div className='w-full mt-4 text-center font-semibold'>Loading...</div>;
    }

    if (!userId) {
        return (
            <div className='w-full mt-4 text-center font-semibold'>
                <h2 className='text-3xl font-semibold'>Sign In Required!</h2>
                <Link href={'/signin'} className='mt-2 text-violet-500 underline'>Sign In</Link>
            </div>
        );
    }

    return (
        <>
            <Toaster />

            <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                {/* db name */}
                <div>
                    <label htmlFor="dbName" className='font-semibold'>Name</label>
                    <input
                        type="text"
                        id='dbName'
                        placeholder='Database Name e.g. Acme DB'
                        {...register('dbName', { required: 'Database name is required', minLength: { value: 3, message: 'Must be at least 3 characters' } })}
                        className={`w-full h-12 mt-2 p-3 border rounded-lg outline-none ring-violet-500 ${errors.dbName ? 'border-red-500' : 'border-zinc-300 hover:ring-2'}`}
                    />
                    {errors.dbName && <p className="text-red-500 text-sm mt-1">{errors.dbName.message}</p>}
                </div>

                {/* connection url */}
                <div>
                    <label htmlFor="connectionURL" className='font-semibold'>Connection URL</label>
                    <textarea
                        id="connectionURL"
                        placeholder='Connection URL e.g. mongodb://username:password@host:port/database'
                        {...register('connectionURL', {
                            required: 'Connection URL is required',
                            pattern: { value: /^mongodb(\+srv)?:\/\/.+/, message: 'Invalid MongoDB URL' }
                        })}
                        className={`w-full h-24 mt-2 p-3 border rounded-lg outline-none ring-violet-500 resize-none ${errors.connectionURL ? 'border-red-500' : 'border-zinc-300 hover:ring-2'}`}
                    />
                    {errors.connectionURL && <p className="text-red-500 text-sm mt-1">{errors.connectionURL.message}</p>}
                </div>

                {/* get schema */}
                <div className='flex justify-between items-center'>
                    <button
                        type="button"
                        onClick={fetchSchema}
                        disabled={isFetchingSchema}
                        className='bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg'
                    >
                        {isFetchingSchema ? "Fetching Schema..." : "Get DB Schema"}
                    </button>
                </div>

                {/* schema display */}
                {dbSchema && (
                    <div>
                        <label className='font-semibold'>Detected Schema</label>
                        <textarea
                            readOnly
                            value={dbSchema}
                            className={`w-full h-24 mt-2 p-3 border rounded-lg outline-none ring-violet-500 resize-none ring-2`}
                        />
                    </div>
                )}

                <div className='w-full flex justify-end'>
                    <button
                        type="submit"
                        className={`mt-2 py-2 px-4 text-white font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 ${isSubmitting || !isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Connection'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default MongoDBConnection;
