import React from 'react'
import { LuTable2, LuChartPie, LuCopy, LuDownload } from "react-icons/lu";

const FormatResultOptions = () => {
    return (
        <div className='flex justify-between'>
            {/* result format */}
            <div className='flex'>

                {/* table */}
                <button className='px-3 py-2 text-violet-500 font-semibold flex gap-1 items-center border border-zinc-300 rounded-l-xl'>
                    {/* icon */}
                    <LuTable2 />
                    Table
                </button>
                {/* chart */}
                <button className='px-3 py-2 font-semibold flex gap-1 items-center border border-l-0 border-zinc-300 rounded-r-xl hover:bg-zinc-100 transition-all duration-300 cursor-pointer'>
                    {/* icon */}
                    <LuChartPie />
                    Chart
                </button>

            </div>

            {/* export result format */}
            <div className='flex gap-2'>

                {/* copy data as csv button */}
                <button className='p-3 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer'>
                    <LuCopy />
                </button>

                {/* download data as csv button */}
                <button className='p-3 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer'>
                    <LuDownload />
                </button>

            </div>
        </div>
    )
}

export default FormatResultOptions