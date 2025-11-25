import React, { useState } from 'react'
import { IoCopyOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";

const CopyQuery = ({ query }) => {

    const [copiedQuery, setCopiedQuery] = useState(false); // New state for copied indicator

    // copy query
    const handleCopyQuery = () => {
        if (query) {
            // Create a temporary textarea element to copy text
            const el = document.createElement('textarea');
            el.value = query;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy'); // Execute copy command
            document.body.removeChild(el); // Remove temporary element

            // Set copied status to true and reset after 1 seconds
            setCopiedQuery(true);
            setTimeout(() => {
                setCopiedQuery(false);
            }, 1000); // Display "Copied!" for 1 seconds
        }
    };

    return (
        <button
            onClick={handleCopyQuery}
            className='h-10 w-10 text-lg text-white bg-white/10 rounded-xl absolute top-6 right-4 flex justify-center items-center cursor-pointer'>
            {/* conditional rendering icons */}
            {copiedQuery ? (
                // Show "Copied!" status
                <FaRegCircleCheck />
            ) : (
                <IoCopyOutline />
            )}
        </button>
    )
}

export default CopyQuery