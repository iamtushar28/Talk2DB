import React from 'react'
import { MdOutlineLock } from "react-icons/md";

const Footer = () => {
    return (
        <div className="w-full md:w-[46%] flex gap-2">
            {/* lock icon */}
            <MdOutlineLock className="text-3xl" />
            <p className="text-sm text-zinc-600">
                Connections are stored fully encrypted. We adhere to the strict
                privacy and security policies. We don't store any data from connected
                data sources.
            </p>
        </div>
    )
}

export default Footer