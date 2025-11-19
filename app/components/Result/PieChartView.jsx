import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Color palette for pie slices
const COLORS = [
    '#1E1B4B', '#312E81', '#4338CA', '#4F46E5', '#6D28D9',
    '#7C3AED', '#9333EA', '#A21CAF', '#C026D3', '#E11D48',
];

// Renders a pie chart using dynamic keys
const PieChartView = ({ data, stringKey, numericKey }) => (
    <div className="w-full flex justify-center items-center overflow-x-auto">
        <div className="h-[400px] w-full md:w-[500px]">
            {/* Responsive container to keep chart scaling properly */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 50 }}>
                    {/* Main pie visualization */}
                    <Pie
                        data={data}
                        dataKey={numericKey}  // numeric value for slice size
                        nameKey={stringKey}  // label for each slice
                        cx="50%"
                        cy="45%"  // shifted up to make room for legend
                        outerRadius={120}
                        label
                        tabIndex={-1} // prevent unwanted tab focus
                    >
                        {/* Slice colors */}
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="none"
                            />
                        ))}
                    </Pie>

                    {/* Hover tooltip */}
                    <Tooltip />

                    {/* Legend under the chart */}
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
