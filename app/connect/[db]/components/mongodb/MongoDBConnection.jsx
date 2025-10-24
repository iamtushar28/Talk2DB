'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import SchemaDisplay from './SchemaDisplay';
import ConnectionFormField from './ConnectionFormField';
import ActionButton from './ActionButton';

const MongoDBConnection = () => {
    // STATE MANAGEMENT: Well-defined state variables for user session, UI loading, and schema data.
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [dbSchema, setDbSchema] = useState('');
    const [isFetchingSchema, setIsFetchingSchema] = useState(false);

    const router = useRouter();

    // SIDE EFFECT / AUTHENTICATION: Manages user session using Firebase onAuthStateChanged.
    // RECOMMENDATION: Extract this logic into a custom `useAuth` hook for separation of concerns and reusability.
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

    // FORM MANAGEMENT: Uses react-hook-form for efficient validation, state, and form handling.
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

    // Fetch schema from server
    // API INTERACTION: Asynchronous handler for fetching the database schema from a Next.js API endpoint.
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

    // Submit form
    // DATA PERSISTENCE: Saves connection details and schema to Firebase Firestore.
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
            // Redirecting after connection
            router.push("/");

        } catch (e) {
            console.error("Error adding document: ", e);
            // IMPROVEMENT: Include the specific error message (e.g., e.message) in the toast for better debugging.
            toast.error("Failed to save connection to Firebase.");
        }
    };

    // CONDITIONAL RENDERING: Handles loading and unauthenticated states.
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
            {/* react toast notification */}
            <Toaster />

            // FORM STRUCTURE: Parent component manages form submission via handleSubmit.
            <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                {/* 1. DB Name Field (Using the new component) */}
                // REUSABILITY: Utilizes ConnectionFormField for a clean, encapsulated input field display and error handling.
                <ConnectionFormField
                    id="dbName"
                    label="Name"
                    placeholder="Database Name e.g. Acme DB"
                    register={register('dbName', {
                        required: 'Database name is required',
                        minLength: { value: 3, message: 'Must be at least 3 characters' }
                    })}
                    errorMessage={errors.dbName?.message}
                />

                {/* 2. Connection URL Field (Using the new component) */}
                // VALIDATION: Includes a regex pattern for basic MongoDB connection string format checking.
                <ConnectionFormField
                    id="connectionURL"
                    label="Connection URL"
                    placeholder="Connection URL e.g. mongodb://..."
                    register={register('connectionURL', {
                        required: 'Connection URL is required',
                        pattern: { value: /^mongodb(\+srv)?:\/\/.+/, message: 'Invalid MongoDB URL' }
                    })}
                    errorMessage={errors.connectionURL?.message}
                    isTextarea={true}
                />

                {/* get schema */}
                {!dbSchema && (
                    <div className='flex justify-end'>
                        // REUSABILITY: ActionButton abstracts loading state and styling.
                        // DEPENDENCY: Button is disabled if schema fetching is in progress or client-side validation fails (`!isValid`).
                        <ActionButton
                            type="button"
                            onClick={fetchSchema}
                            isDisabled={isFetchingSchema || !isValid}
                            isLoading={isFetchingSchema}
                        >
                            Get DB Schema
                        </ActionButton>
                    </div>
                )}

                {/* schema display */}
                {dbSchema && (
                    // REUSABILITY: Uses SchemaDisplay component to separate presentation logic for the schema textarea.
                    <SchemaDisplay dbSchema={dbSchema} />
                )}

                // CONDITIONAL RENDERING: The submission button is only visible after a schema has been successfully fetched.
                {dbSchema && (
                    <div className='w-full flex justify-end'>
                        <ActionButton
                            type="submit"
                            isDisabled={isSubmitting || !isValid}
                            isLoading={isSubmitting}
                        >
                            Connect DB
                        </ActionButton>
                    </div>
                )}
            </form>
        </>
    );
};

export default MongoDBConnection;