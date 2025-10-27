'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import ConnectionFormField from '../common/ConnectionFormField';
import FetchSchemaSection from '../common/FetchSchemaSection';
import ActionButton from '../common/ActionButton';

const MongoDBConnection = () => {
    // Local State
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [dbSchema, setDbSchema] = useState('');

    const router = useRouter();

    // Authentication State Handling
    // Subscribes to Firebase Auth state changes. Ensures the user is logged in.
    // If the user document doesn't exist in Firestore, it creates one.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email || "",
                        displayName: user.displayName || "",
                        createdAt: new Date(),
                    });
                }
            } else {
                setUserId(null);
                toast.error("You must be logged in to save a connection.");
            }
            setIsLoadingUser(false);
        });

        return () => unsubscribe();
    }, []);

    // Form Configuration
    // Uses react-hook-form for efficient input management and validation.
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm({
        defaultValues: { dbName: '', connectionURL: '', dbType: 'mongodb' },
        mode: 'onBlur',
    });

    // Form Submission: Save MongoDB Connection
    // Persists the connection details into Firestore under:
    // users/{userId}/connections/{connectionDoc}
    const onSubmit = async (data) => {
        if (!userId) {
            toast.error("Authentication error: User ID is missing.");
            return;
        }

        try {
            const userConnectionsRef = collection(db, "users", userId, "connections");

            await addDoc(userConnectionsRef, {
                dbName: data.dbName,
                connectionURL: data.connectionURL,
                dbType: data.dbType,
                dbSchema: dbSchema || "Schema not fetched",
                createdAt: new Date(),
            });

            toast.success("MongoDB connection saved successfully.");
            reset();
            setDbSchema('');
            router.push("/");

        } catch (e) {
            console.error("Error adding connection: ", e);
            toast.error("Failed to save connection to Firestore.");
        }
    };

    // Conditional UI States
    if (isLoadingUser) {
        return <div className='w-full mt-4 text-center font-semibold'>Loading...</div>;
    }

    if (!userId) {
        return (
            <div className='w-full mt-4 text-center font-semibold'>
                <h2 className='text-3xl font-semibold'>Sign In Required</h2>
                <Link href={'/signin'} className='mt-2 text-violet-500 underline'>Sign In</Link>
            </div>
        );
    }

    // Render: MongoDB Connection Form
    return (
        <>
            <Toaster />

            <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Database Name Field */}
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

                {/* Connection URL Field */}
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

                {/* Hidden DB Type Field (Default: MongoDB) */}
                <input type="hidden" value="mongodb" {...register('dbType')} />

                {/* Schema Fetching Section (Reusable Component) */}
                <FetchSchemaSection
                    getValues={getValues}
                    isValid={isValid}
                    setDbSchema={setDbSchema}
                />

                {/* Submit Button (Visible Only When Schema Exists) */}
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
