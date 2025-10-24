import React from 'react';

const SchemaDisplay = ({ dbSchema, fetchSchema, isFetchingSchema }) => {
    if (!dbSchema) return null;

    return (
        <div>
            <label className='font-semibold'>Detected Schema</label>
            <textarea
                readOnly
                value={dbSchema}
                className={`w-full h-44 mt-2 p-3 border rounded-lg outline-none ring-violet-500 border-zinc-300 hover:ring-2`}
            />
        </div>
    );
};

export default SchemaDisplay;