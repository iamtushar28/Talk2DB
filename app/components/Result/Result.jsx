import React, { useState, useEffect } from 'react';
import { IoAddSharp } from "react-icons/io5";
import FormatResultOptions from './FormatResultOptions';
import ResultTable from './ResultTable';
import ResultChart from './ResultChart';
import ResultLoader from './ResultLoader';

const Result = ({ result, onClose }) => {
    const [viewMode, setViewMode] = useState('table'); // current display mode
    const [profiledData, setProfiledData] = useState(null); // cached profiling result

    // Switch between table / chart / loading modes
    const handleChangeView = async (mode) => {
        if (mode === 'chart') {
            // Use cached results if profiling already done
            if (profiledData) {
                setViewMode('chart');
                return;
            }

            // Show loader during profiling
            setViewMode('loading');

            // Run profiling once
            const profile = await profileData(result);
            setProfiledData(profile);

            setViewMode('chart');
        } else {
            setViewMode(mode);
        }
    };

    // --------------------------------
    // Profile raw row-based data
    // --------------------------------
    const profileData = async (data) => {
        if (!data || data.length === 0) return null;

        const firstRow = data[0]; // infer schema from first row
        const columns = Object.keys(firstRow);

        const profile = columns.map((col) => {
            const values = data.map((row) => row[col]);
            const numericValues = values.filter((v) => !isNaN(v) && v !== null && v !== '');
            const uniqueValues = [...new Set(values)];
            const sampleValues = values.slice(0, 5); // first 5 values for preview

            return {
                name: col,
                sample_values: sampleValues,
                unique_count: uniqueValues.length,
                type: detectType(values, numericValues),
                min: numericValues.length ? Math.min(...numericValues) : null,
                max: numericValues.length ? Math.max(...numericValues) : null,
            };
        });

        // simulate slow computation
        await new Promise((r) => setTimeout(r, 1500));

        return { columns: profile, row_count: data.length };
    };

    // Basic type detection: numeric → date → string
    const detectType = (values, numericValues) => {
        if (numericValues.length === values.length) return 'number';
        if (values.every(v => !isNaN(Date.parse(v)))) return 'date';
        return 'string';
    };

    // Reset when new result data arrives
    useEffect(() => {
        setProfiledData(null);
        setViewMode('table');
    }, [result]);


    // No results fallback UI
    if (!result || result.length === 0) {
        return (
            <div className='h-screen w-full bg-black/30 fixed top-0 left-0 flex justify-center items-center'>
                <div className='w-[90%] h-fit px-4 py-8 bg-white rounded-lg flex flex-col gap-4 relative'>
                    <button
                        onClick={onClose}
                        className='w-fit p-3 border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer absolute top-2 right-2'
                    >
                        <IoAddSharp className='rotate-45 text-xl' />
                    </button>
                    <h4 className='text-lg font-semibold'>Results</h4>
                    <p className='text-zinc-500'>No data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start overflow-y-auto py-10 px-2 z-50">
            <div className='w-full max-w-6xl bg-white rounded-3xl p-5 md:p-8 relative'>
                {/* Close modal button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-3 border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer'
                >
                    <IoAddSharp className='rotate-45 text-xl' />
                </button>

                <h4 className='text-lg font-semibold mb-4'>Results</h4>

                {/* Options to switch view */}
                <FormatResultOptions
                    result={result}
                    viewMode={viewMode}
                    onChangeView={handleChangeView}
                />

                {/* Table view */}
                {viewMode === 'table' && <ResultTable result={result} />}

                {/* Loader while profiling */}
                {viewMode === 'loading' && <ResultLoader />}

                {/* Chart view */}
                {viewMode === 'chart' && (
                    <ResultChart profiledData={profiledData} rawData={result} />
                )}
            </div>
        </div>
    );
};

export default Result;
