'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ActionButton from './ActionButton';
import SchemaDisplay from './SchemaDisplay';

const FetchSchemaSection = ({ getValues, isValid, setDbSchema }) => {
    // Local state for fetching status and schema
    const [isFetching, setIsFetching] = useState(false);
    const [schema, setSchema] = useState('');

    // Fetch schema dynamically based on dbType
    const fetchSchema = async () => {
        const { dbName, connectionURL, dbType } = getValues();

        if (!dbName || !connectionURL) {
            toast.error("Please fill DB name and connection URL first.");
            return;
        }

        if (!dbType) {
            toast.error("Database type is missing.");
            return;
        }

        setIsFetching(true);

        try {
            // Dynamic API route based on dbType
            const res = await fetch(`/api/${dbType}/get-schema`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dbName, connectionURL }),
            });

            const data = await res.json();

            if (res.ok) {
                const formattedSchema = JSON.stringify(data.schema, null, 2);
                setSchema(formattedSchema);
                setDbSchema(formattedSchema);
                toast.success("Schema fetched successfully.");
            } else {
                toast.error(data.error || "Failed to fetch schema.");
            }
        } catch (err) {
            console.error("Error fetching schema:", err);
            toast.error("Unexpected error occurred while fetching schema.");
        } finally {
            setIsFetching(false);
        }
    };

    // Render schema button or schema display
    return (
        <div className="w-full">
            {!schema ? (
                <div className="flex justify-end">
                    <ActionButton
                        type="button"
                        onClick={fetchSchema}
                        isDisabled={isFetching || !isValid}
                        isLoading={isFetching}
                    >
                        Get Schema
                    </ActionButton>
                </div>
            ) : (
                <SchemaDisplay dbSchema={schema} />
            )}
        </div>
    );
};

export default FetchSchemaSection;
