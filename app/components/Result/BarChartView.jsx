import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const BarChartView = ({ data, stringKey, numericKey }) => {
    // Dynamically adjust chart width so bars don't overlap
    const chartWidth = `${Math.max(600, data.length * 120)}px`;

    return (
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
            {/* Wrapper ensures horizontal scrolling for large datasets */}
            <div
                className="h-[400px]"
                style={{
                    minWidth: chartWidth,
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                }}
            >
                {/* Handle responsive scaling */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        {/* Category axis */}
                        <XAxis dataKey={stringKey} tick={{ fontSize: 12 }} />

                        {/* Value axis */}
                        <YAxis tick={{ fontSize: 12 }} />

                        {/* Hover details */}
                        <Tooltip />

                        {/* Chart legend */}
                        <Legend />

                        {/* Main bar series */}
                        <Bar
                            dataKey={numericKey}
                            fill="#7C3AED"          // bar color
                            radius={[8, 8, 0, 0]}  // rounded top corners
                            stroke="none"
                            tabIndex={-1}          // avoid focus highlight
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChartView;
