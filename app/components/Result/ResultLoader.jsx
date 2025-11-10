import React from 'react'
import { PiSpinnerBold } from 'react-icons/pi';

const ResultLoader = () => {
    return (
        <div className='h-fit min-h-44 py-10 px-4 w-full border border-zinc-300 rounded-3xl flex justify-center items-center'>
            {/* loader */}
            <div className='h-12 w-96 text-purple-600 bg-purple-100 rounded-xl flex gap-2 justify-center items-center'>
                <p>Preparing visualization</p>
                {/* spinner */}
                <PiSpinnerBold className='animate-spin text-xl' />
            </div>
        </div>
    )
}

export default ResultLoader