import React, { useState } from 'react';
import { IoAddSharp } from "react-icons/io5";
import FormatResultOptions from './FormatResultOptions';
import ResultTable from './ResultTable';
import ResultChart from './ResultChart';
import ResultLoader from './ResultLoader';

const Result = ({ result, onClose }) => {
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'chart' | 'loading'

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
        <div className='h-screen w-full bg-black/30 fixed top-0 left-0 flex justify-center items-center overflow-auto p-4'>
            <div className='w-full max-w-6xl h-fit px-4 py-8 bg-white rounded-3xl flex flex-col gap-4 relative'>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className='w-fit p-3 border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer absolute top-2 right-2'
                >
                    <IoAddSharp className='rotate-45 text-xl' />
                </button>

                <h4 className='text-lg font-semibold'>Results</h4>

                {/* format result options component */}
                <FormatResultOptions
                    result={result}
                    viewMode={viewMode}
                    onChangeView={setViewMode}
                />

                {/* Conditional View Rendering */}
                {viewMode === 'table' && <ResultTable result={result} />}
                {viewMode === 'chart' && <ResultChart result={result} />}
                {viewMode === 'loading' && <ResultLoader />}
            </div>
        </div>
    );
};

export default Result;
