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
    const chartWidth = `${Math.max(600, data.length * 120)}px`;

    return (
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
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
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey={stringKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey={numericKey}
                            fill="#7C3AED"
                            radius={[8, 8, 0, 0]}
                            stroke="none"
                            tabIndex={-1}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChartView;
