import React from 'react'
import { FaCircleInfo } from "react-icons/fa6";

const ErrorMessage = ({ errorMessage }) => {
    return (
        <div className='w-full p-4 bg-red-50 text-red-800 rounded-lg flex gap-2 items-center'>
            {/* icon */}
            <FaCircleInfo className='hidden md:block' />
            {/* message */}
            <p>{errorMessage}</p>
        </div>
    )
}

export default ErrorMessage