import React from 'react'
import { LuTable2, LuChartPie } from "react-icons/lu";
import DownloadCSV from './DownloadCSV';

const FormatResultOptions = ({ result, viewMode, onChangeView }) => {
    return (
        <div className='flex justify-between items-center'>

            {/* View format toggle */}
            <div className='flex'>
                {/* Table button */}
                <button
                    onClick={() => onChangeView('table')}
                    className={`p-2 text-sm font-semibold flex gap-1 items-center border border-zinc-300 rounded-l-full transition-all duration-300 cursor-pointer
                        ${viewMode === 'table'
                            ? 'bg-violet-100 text-violet-600 border-violet-300'
                            : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                    <LuTable2 />
                    Table
                </button>

                {/* Chart button */}
                <button
                    onClick={() => onChangeView('chart')}
                    className={`p-2 text-sm font-semibold flex gap-1 items-center border border-l-0 border-zinc-300 rounded-r-full transition-all duration-300 cursor-pointer
                        ${viewMode === 'chart'
                            ? 'bg-violet-100 text-violet-600 border-violet-300'
                            : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                    <LuChartPie />
                    Chart
                </button>
            </div>

            {/* Download CSV */}
            <DownloadCSV result={result} />
        </div>
    );
};

export default FormatResultOptions;
