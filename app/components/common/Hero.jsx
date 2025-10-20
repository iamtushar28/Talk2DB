import React from 'react'
import QueryInputBox from './QueryInputBox'
import GeneratedResponse from './GeneratedResponse'

const Hero = () => {
    return (
        <div className='w-full h-fit py-16 md:py-24 flex flex-col gap-8 md:gap-2 justify-center items-center'>

            {/* title */}
            <div className='flex flex-col justify-center items-center'>
                <h4 className='text-2xl'>
                    Generate SQL Query
                </h4>
                <h4 className='text-lg text-zinc-600'>
                    Turn everyday language into queries.
                </h4>
                <button className='ml-1 text-violet-500 hover:underline transition-all duration-300 cursor-pointer'>Quick guide.</button>
            </div>

            {/* query input & result section */}
            <div className='w-full px-4 flex flex-col md:flex-row justify-center gap-12 md:gap-6'>

                {/* query input box */}
                <QueryInputBox />

                {/* generated response */}
                <GeneratedResponse />

            </div>

        </div>
    )
}

export default Hero