import React from 'react';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const DownloadCSV = ({ result, fileName = 'query_result.csv' }) => {

    const downloadCSV = () => {
        if (!result || result.length === 0) return;

        // Get table headers
        const headers = Object.keys(result[0]);

        // Convert rows to CSV
        const csvRows = [
            headers.join(','), // header row
            ...result.map(row =>
                headers.map(field => {
                    let val = row[field];

                    // Convert objects or arrays to JSON string
                    if (typeof val === 'object' && val !== null) {
                        val = JSON.stringify(val);
                    }

                    // Escape double quotes in strings
                    if (typeof val === 'string') {
                        val = `"${val.replace(/"/g, '""')}"`;
                    }

                    return val;
                }).join(',')
            )
        ];

        const csvString = csvRows.join('\n');

        // Create blob and trigger download
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={downloadCSV}
            className='px-3 py-2 text-sm border border-zinc-300 rounded-full hover:bg-zinc-100 transition-all duration-300 cursor-pointer flex gap-2 items-center'>
            .csv
            <PiMicrosoftExcelLogoFill className='text-lg text-green-600' />
        </button>
    );
};

export default DownloadCSV;
