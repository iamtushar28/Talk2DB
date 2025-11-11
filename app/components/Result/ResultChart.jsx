import React, { useState } from 'react';
import BarChartView from './BarChartView';
import PieChartView from './PieChartView';
import ChartToggleButtons from './ChartToggleButtons';

const ResultChart = ({ rawData, profiledData }) => {
    if (!profiledData || !profiledData.columns) {
        return (
            <div className="h-fit min-h-64 py-10 w-full border border-zinc-300 rounded-3xl flex justify-center items-center text-zinc-600">
                <p>Profiling data not available.</p>
            </div>
        );
    }

    const stringCols = profiledData.columns.filter((c) => c.type === 'string');
    const numericCols = profiledData.columns.filter((c) => c.type === 'number');

    const stringKey = stringCols[0]?.name;
    const numericKey = numericCols[0]?.name;

    // Convert numeric strings → numbers
    const normalizedData = rawData.map((row) => {
        const converted = { ...row };
        profiledData.columns.forEach((col) => {
            if (col.type === 'number' && typeof row[col.name] === 'string') {
                const parsed = parseFloat(row[col.name]);
                converted[col.name] = isNaN(parsed) ? 0 : parsed;
            }
        });
        return converted;
    });

    const [chartType, setChartType] = useState('bar'); // default

    return (
        <div className="h-fit min-h-[400px] w-full py-6 border border-zinc-300 rounded-3xl flex flex-col gap-6 justify-center items-center bg-white">

            <div className="flex justify-between w-full px-4 items-center">
                <h4 className="text-lg font-semibold text-zinc-700 capitalize">
                    {chartType === 'bar' ? 'Bar Chart' : 'Pie Chart'}
                </h4>

                <ChartToggleButtons currentChart={chartType} onChange={setChartType} />
            </div>

            {chartType === 'bar' && (
                <BarChartView
                    data={normalizedData}
                    stringKey={stringKey}
                    numericKey={numericKey}
                />
            )}

            {chartType === 'pie' && (
                <PieChartView
                    data={normalizedData}
                    stringKey={stringKey}
                    numericKey={numericKey}
                />
            )}
        </div>
    );
};

export default ResultChart;
