'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ConnectionFormField from '../common/ConnectionFormField';
import ActionButton from '../common/ActionButton';
import FetchSchemaSection from '../common/FetchSchemaSection';

const MySQLConnection = () => {
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [dbSchema, setDbSchema] = useState('');
    const router = useRouter();

    // Manage Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);

                // Ensure user document exists
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || '',
                        createdAt: new Date(),
                    });
                }

            } else {
                setUserId(null);
                toast.error('You must be logged in to save a connection.');
            }
            setIsLoadingUser(false);
        });

        return () => unsubscribe();
    }, []);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = useForm({
        defaultValues: { dbName: '', connectionURL: '', dbType: 'mysql' },
        mode: 'onBlur',
    });

    // Submit connection data to Firestore
    const onSubmit = async (data) => {
        if (!userId) return toast.error('Authentication error: User ID is missing.');

        try {
            const userConnectionsRef = collection(db, 'users', userId, 'connections');
            await addDoc(userConnectionsRef, {
                dbName: data.dbName,
                connectionURL: data.connectionURL,
                dbType: data.dbType, // hidden mysql
                dbSchema: dbSchema || 'Schema not fetched',
                createdAt: new Date(),
            });

            toast.success('MySQL connection saved successfully!');
            reset();
            setDbSchema('');
            router.push('/'); // redirect after save
        } catch (err) {
            console.error(err);
            toast.error('Failed to save connection to Firestore.');
        }
    };

    // Loading and authentication states
    if (isLoadingUser) {
        return <div className="w-full mt-4 text-center font-semibold">Loading...</div>;
    }

    if (!userId) {
        return (
            <div className="w-full mt-4 text-center font-semibold">
                <h2 className="text-3xl font-semibold">Sign In Required!</h2>
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Database Name */}
                <ConnectionFormField
                    id="dbName"
                    label="Database Name"
                    placeholder="Database Name e.g. Acme DB"
                    register={register('dbName', {
                        required: 'Database name is required',
                        minLength: { value: 3, message: 'Must be at least 3 characters' },
                    })}
                    errorMessage={errors.dbName?.message}
                />

                {/* Connection URL */}
                <ConnectionFormField
                    id="connectionURL"
                    label="Connection URL"
                    placeholder="Connection URL e.g. mysql://user:pass@localhost:3306/mydb"
                    register={register('connectionURL', {
                        required: 'Connection URL is required',
                        pattern: {
                            value: /^mysql:\/\/.+/,
                            message: 'Invalid MySQL URL format',
                        },
                    })}
                    errorMessage={errors.connectionURL?.message}
                    isTextarea={true}
                />

                {/* Hidden DB Type */}
                <input type="hidden" value="mysql" {...register('dbType')} />

                {/* Fetch Schema Section */}
                <FetchSchemaSection getValues={getValues} isValid={isValid} setDbSchema={setDbSchema} />

                {/* Submit Button */}
                {dbSchema && (
                    <div className="w-full flex justify-end">
                        <ActionButton type="submit" isDisabled={isSubmitting || !isValid} isLoading={isSubmitting}>
                            Connect DB
                        </ActionButton>
                    </div>
                )}
            </form>
        </>
    );
};

export default MySQLConnection;
