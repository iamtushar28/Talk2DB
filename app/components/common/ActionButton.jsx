import React from 'react';
import { PiSpinnerBold } from 'react-icons/pi';
import { IoPlayOutline } from 'react-icons/io5';

/**
 * Highly reusable ActionButton component for various actions.
 * It dynamically displays text and an icon based on its state (idle or running).
 */
const ActionButton = ({
    onClick,
    isDisabled,
    isRunning,
    idleLabel,
    runningLabel = 'Running', // Default to 'Running' if not provided
    IdleIcon = IoPlayOutline // Default to a Play icon if not provided
}) => {

    // Use the IdleIcon passed in the props
    const CustomIcon = IdleIcon;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
        px-3 md:px-4 py-2 text-sm font-semibold text-black 
        rounded-3xl flex gap-2 items-center cursor-pointer 
        transition-all duration-300
        
        // Base state and hover
        bg-white hover:bg-zinc-100 
        
        // Disabled state
        disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-white 
        
        // Running state (overrides base background if running)
        ${isRunning ? 'bg-zinc-100' : ''}
      `}
        >
            {isRunning ? (
                <>
                    {runningLabel}
                    <PiSpinnerBold className='text-xl animate-spin' />
                </>
            ) : (
                <>
                    {idleLabel}
                    <CustomIcon className='text-lg' />
                </>
            )}
        </button>
    );
};

export default ActionButton;