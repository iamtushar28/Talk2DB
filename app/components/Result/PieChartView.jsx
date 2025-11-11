import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const COLORS = [
    '#1E1B4B',
    '#312E81',
    '#4338CA',
    '#4F46E5',
    '#6D28D9',
    '#7C3AED',
    '#9333EA',
    '#A21CAF',
    '#C026D3',
    '#E11D48',
];

const PieChartView = ({ data, stringKey, numericKey }) => (
    <div className="w-full flex justify-center items-center overflow-x-auto">
        <div
            className="
                min-w-[400px] sm:min-w-[500px] md:min-w-[600px]
                h-[420px] md:h-[450px] lg:h-[480px] p-4
            "
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 50 }}>
                    <Pie
                        data={data}
                        dataKey={numericKey}
                        nameKey={stringKey}
                        cx="50%"
                        cy="45%"  // move slightly up for legend space
                        outerRadius={120}  // keeps original size
                        label
                        tabIndex={-1}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                            marginTop: 20,
                            fontSize: '12px',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default PieChartView;
