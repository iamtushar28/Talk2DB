import React from 'react'
import { LuTable2, LuChartPie } from "react-icons/lu";
import DownloadCSV from './DownloadCSV';

const FormatResultOptions = ({ result }) => {
    return (
        <div className='flex justify-between'>
            {/* result format */}
            <div className='flex'>

                {/* table */}
                <button className='p-2 text-sm text-violet-500 font-semibold flex gap-1 items-center border border-zinc-300 rounded-l-full'>
                    {/* icon */}
                    <LuTable2 />
                    Table
                </button>
                {/* chart */}
                <button className='p-2 text-sm font-semibold flex gap-1 items-center border border-l-0 border-zinc-300 rounded-r-full hover:bg-zinc-100 transition-all duration-300 cursor-pointer'>
                    {/* icon */}
                    <LuChartPie />
                    Chart
                </button>

            </div>

            {/* download data as csv button */}
            <DownloadCSV result={result} />

        </div>
    )
}

export default FormatResultOptions