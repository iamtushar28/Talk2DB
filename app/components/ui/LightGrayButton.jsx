import React from 'react'

const LightGrayButton = ({ title, icon }) => {
    return (
        <button className='px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-lg flex gap-2 items-center cursor-pointer transition-all duration-300'>
            {title}
            <span>
                {icon}
            </span>
        </button>
    )
}

export default LightGrayButton