import React from 'react';
import { IoAddSharp } from "react-icons/io5";
import FormatResultOptions from './FormatResultOptions';

const Result = ({ result, onClose }) => {
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

    // Dynamically get table columns from object keys
    const columns = Object.keys(result[0]);

    return (
        <div className='h-screen w-full bg-black/30 fixed top-0 left-0 flex justify-center items-center overflow-auto p-4'>
            <div className='w-full max-w-6xl h-fit px-4 py-8 bg-white rounded-lg flex flex-col gap-4 relative'>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className='w-fit p-3 border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer absolute top-2 right-2'
                >
                    <IoAddSharp className='rotate-45 text-xl' />
                </button>

                <h4 className='text-lg font-semibold'>Results</h4>

                {/* format result options component */}
                <FormatResultOptions result={result} />

                {/* Table */}
                <div className='overflow-auto max-h-[70vh]'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 sticky top-0 capitalize'>
                            <tr>
                                <th className='px-4 py-3 text-left'>#</th>
                                {columns.map((col) => (
                                    <th key={col} className='px-4 py-3 text-left'>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((row, idx) => (
                                <tr key={idx} className='hover:bg-zinc-50'>
                                    {/* Sr No column */}
                                    <td className='px-4 py-4 border-b border-gray-200 font-medium text-zinc-700'>
                                        {idx + 1}
                                    </td>

                                    {/* Data columns */}
                                    {columns.map((col) => (
                                        <td key={col} className='px-4 py-4 border-b border-gray-200'>
                                            {typeof row[col] === 'object' && row[col] !== null
                                                ? JSON.stringify(row[col])
                                                : row[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
};

export default Result;
