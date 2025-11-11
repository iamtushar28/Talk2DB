import React from 'react';
import { IoBarChart } from "react-icons/io5";
import { FaChartPie } from "react-icons/fa";

const ChartToggleButtons = ({ currentChart, onChange }) => {
    return (
        <div className="flex items-center border border-zinc-300 rounded-full overflow-hidden">
            {/* Bar Chart Button */}
            <button
                onClick={() => onChange('bar')}
                className={`p-2 px-4 text-sm font-semibold flex items-center gap-1 transition-all duration-300 cursor-pointer
          ${currentChart === 'bar'
                        ? 'bg-violet-100 text-violet-600'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
            >
                <IoBarChart className="text-base" />
                {/* chart type name */}
                <span className='hidden md:block'>
                    Bar
                </span>
            </button>

            {/* Pie Chart Button */}
            <button
                onClick={() => onChange('pie')}
                className={`p-2 px-4 text-sm font-semibold flex items-center gap-1 transition-all duration-300 border-l border-zinc-300 cursor-pointer
          ${currentChart === 'pie'
                        ? 'bg-violet-100 text-violet-600'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
            >
                <FaChartPie className="text-base" />
                {/* chart type name */}
                <span className='hidden md:block'>
                    Pie
                </span>
            </button>
        </div>
    );
};

export default ChartToggleButtons;
