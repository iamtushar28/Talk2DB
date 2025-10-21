import React from 'react'

const UiButton = ({ title, icon }) => {
    return (
        <button className='px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 items-center cursor-pointer transition-all duration-300'>
            {title}
            <span className='mt-1'>
                {icon}
            </span>
        </button>
    )
}

export default UiButton