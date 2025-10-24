import React from 'react';
import { PiSpinnerBold } from "react-icons/pi";

const ActionButton = ({
    children,
    type = 'button', // 'button' or 'submit'
    onClick,
    isDisabled = false,
    isLoading = false,
    fullWidth = false
}) => {
    // Base styles for the button
    const baseClasses = `
        py-2 px-4 text-white font-semibold rounded-lg 
        bg-violet-600 hover:bg-violet-700 
        flex gap-2 items-center justify-center transition-colors
        ${fullWidth ? 'w-full' : ''}
    `;

    // Classes for disabled/loading state
    const disabledClasses = (isDisabled || isLoading) ?
        'opacity-50 cursor-not-allowed' :
        'cursor-pointer';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            className={`${baseClasses} ${disabledClasses}`}
        >
            {isLoading ?
                <>
                    {/* Display text while loading (e.g., 'Connecting' or 'Fetching') */}
                    <span>Processing</span>
                    <PiSpinnerBold className='text-xl animate-spin' />
                </>
                :
                children
            }
        </button>
    );
};

export default ActionButton;