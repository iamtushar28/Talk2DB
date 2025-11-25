'use client';
import React, { useState } from 'react';
import { updateGeneratedQuery } from "@/redux-store/querySlice";
import { useSelector, useDispatch } from "react-redux";
import { IoPlayOutline } from "react-icons/io5";
import { BiTable, BiEditAlt } from "react-icons/bi";
import ErrorMessage from '../ui/ErrorMessage';
import FormattedQueryViewer from './FormattedQueryViewer';
import ActionButton from './ActionButton';
import Result from '../Result/Result';
import QueryEditor from './QueryEditor';

/**
 * Component: GeneratedResponse
 * Purpose: Displays the generated query, allows editing, execution,
 * and shows results.
 */
const GeneratedResponse = ({ dbConnectionData }) => {
    const dispatch = useDispatch();

    // Local state
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const [isEditing, setIsEditing] = useState(false);        // NEW: Editing mode
    const [editableQuery, setEditableQuery] = useState("");   // NEW: Local editable copy

    const { generatedQuery } = useSelector((state) => state.query);

    const hasQuery = generatedQuery && generatedQuery.trim().length > 0;

    // ----------------------------------------------------------
    // Handle Edit Mode
    // ----------------------------------------------------------
    const handleEdit = () => {
        setEditableQuery(generatedQuery);
        setIsEditing(true);
    };

    // Save edited query
    const handleSaveEdit = () => {
        dispatch(updateGeneratedQuery(editableQuery));
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // ----------------------------------------------------------
    // Execute Query
    // ----------------------------------------------------------
    const handleRunQuery = async () => {
        if (!hasQuery || !dbConnectionData) return;

        setIsRunning(true);
        setError(null);
        setResult(null);

        try {
            const dbType = dbConnectionData.dbType || 'mongodb';
            const route = `/api/${dbType}/execute-query`;

            const res = await fetch(route, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generatedQuery,
                    dbConnectionData,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to execute query.');

            setResult(data.result);
            setShowResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className='w-full md:w-[48%] flex flex-col gap-1'>
            {/* ===== Header ===== */}
            <div className='w-full flex justify-between items-center'>
                <h2 className='font-semibold text-sm'>Output</h2>

                <div className='flex gap-1'>
                    {/* Run Button */}
                    <ActionButton
                        onClick={handleRunQuery}
                        isDisabled={!hasQuery || !dbConnectionData}
                        isRunning={isRunning}
                        idleLabel="Run"
                        runningLabel="Running"
                        IdleIcon={IoPlayOutline}
                    />

                    {/* Edit Button */}
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            disabled={!hasQuery}
                            className='px-3 md:px-4 py-2 text-sm font-semibold bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center disabled:text-zinc-400 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed'
                        >
                            <span className='hidden md:block'>Edit</span>
                            <BiEditAlt className='text-lg' />
                        </button>
                    )}

                    {/* Show Result */}
                    <button
                        onClick={() => setShowResult(true)}
                        disabled={!result}
                        className='px-3 md:px-4 py-2 text-sm font-semibold bg-white hover:bg-zinc-100 rounded-3xl flex gap-2 items-center disabled:text-zinc-400 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed'
                    >
                        <span className='hidden md:block'>Show</span>
                        <BiTable className='text-lg' />
                    </button>
                </div>
            </div>

            {/* ===== Query Viewer / Editor ===== */}
            {isEditing ? (
                <QueryEditor
                    value={editableQuery}
                    onChange={setEditableQuery}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            ) : hasQuery ? (
                <FormattedQueryViewer dbType={dbConnectionData.dbType} query={generatedQuery} />
            ) : (
                <div className='w-full p-4 bg-gray-50 rounded-full'>
                    <p className='text-zinc-500'>Generated query appears here...</p>
                </div>
            )}

            {/* ===== Error ===== */}
            {error && <ErrorMessage errorMessage={error} />}

            {/* ===== Result Modal ===== */}
            {(result && showResult) && (
                <Result
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </div>
    );
};

export default GeneratedResponse;
