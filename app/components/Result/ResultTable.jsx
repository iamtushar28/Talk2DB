import React from 'react';

const ResultTable = ({ result }) => {
    const columns = Object.keys(result[0]); // extract column names from first row

    return (
        <div className='overflow-auto max-h-[62vh] min-h-[60vh]'>
            <table className='w-full'>
                {/* Table header */}
                <thead className='bg-gray-100 sticky top-0 capitalize'>
                    <tr>
                        <th className='px-4 py-3 text-left'>#</th>
                        {columns.map((col) => (
                            <th key={col} className='px-4 py-3 text-left'>{col}</th>
                        ))}
                    </tr>
                </thead>

                {/* Table body */}
                <tbody>
                    {/* Render each row once (duplicates removed) */}
                    {result.map((row, idx) => (
                        <tr key={idx} className='hover:bg-zinc-50'>
                            <td className='px-4 py-4 border-b border-gray-200 font-medium text-zinc-700'>
                                {idx + 1}
                            </td>

                            {/* Render each cell in this row */}
                            {columns.map((col) => (
                                <td key={col} className='px-4 py-4 border-b border-gray-200'>
                                    {/* Convert objects into readable strings */}
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
    );
};

export default ResultTable;
