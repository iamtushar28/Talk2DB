'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ActionButton from './ActionButton';
import SchemaDisplay from './SchemaDisplay';

const FetchSchemaSection = ({ getValues, isValid, setDbSchema }) => {
    // Local State
    const [isFetching, setIsFetching] = useState(false);
    const [schema, setSchema] = useState('');

    // Schema Fetch Handler
    // Sends a POST request to the schema API endpoint and formats the response.
    // Updates local and parent state when schema data is successfully retrieved.
    const fetchSchema = async () => {
        const { dbName, connectionURL } = getValues();

        if (!dbName || !connectionURL) {
            toast.error("Please fill DB name and connection URL first.");
            return;
        }

        setIsFetching(true);

        try {
            const res = await fetch(`/api/mongodb/get-schema`, {
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

    // Render
    // Displays the schema retrieval button or the formatted schema viewer.
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
