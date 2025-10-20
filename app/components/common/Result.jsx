import React from 'react'
import { IoAddSharp } from "react-icons/io5";
import ErrorMessage from '../ui/ErrorMessage';
import FormatResultOptions from './FormatResultOptions';

const Result = () => {
    return (
        <div className='h-screen w-full bg-black/30 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center'>

            {/* result box */}
            <div className='w-[90%] h-fit px-4 py-8 bg-white rounded-lg flex flex-col gap-4 relative'>

                {/* hide result button */}
                <button className='w-fit p-3 border-zinc-300 rounded-lg hover:bg-zinc-100 transition-all duration-300 cursor-pointer absolute top-2 right-2'>
                    {/* icon */}
                    <IoAddSharp className='rotate-45 text-xl' />
                </button>

                {/* title */}
                <h4 className='text-lg font-semibold'>Results</h4>

                {/* result format options */}
                <FormatResultOptions />

                {/* errorMessage */}
                <ErrorMessage errorMessage={'You must have a connected data source to be able to run queries.'} />

            </div>

        </div>
    )
}

export default Result