import React from 'react'
import { LuTable2, LuChartPie } from "react-icons/lu";
import DownloadCSV from './DownloadCSV';

const FormatResultOptions = ({ result }) => {
    return (
        <div className='flex justify-between'>
            {/* result format */}
            <div className='flex'>

                {/* table */}
                <button className='px-2 py-1 text-sm text-violet-500 font-semibold flex gap-1 items-center border border-zinc-300 rounded-l-lg'>
                    {/* icon */}
                    <LuTable2 />
                    Table
                </button>
                {/* chart */}
                <button className='px-2 py-1 text-sm font-semibold flex gap-1 items-center border border-l-0 border-zinc-300 rounded-r-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer'>
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