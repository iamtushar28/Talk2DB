import React, { useEffect, useRef } from "react";

const ProfileBanner = ({ email, options = [], onClose }) => {
    const bannerRef = useRef();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bannerRef.current && !bannerRef.current.contains(event.target)) {
                onClose(); // call the parent handler
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={bannerRef}
            className="w-72 h-fit p-3 bg-white shadow-lg border border-zinc-300 rounded-lg absolute top-[58px] right-4 z-50"
        >
            {/* title */}
            <h2 className="font-semibold">My Account</h2>

            {/* user email */}
            <p className="max-w-72 text-zinc-500 text-sm truncate">{email}</p>

            {/* divider */}
            <div className="w-full h-[0.6px] mt-2 mb-2 bg-zinc-200"></div>

            {/* profile options */}
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={option.onClick}
                    className="w-full p-2 text-start hover:bg-zinc-100 rounded-lg transition-all duration-300 cursor-pointer"
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default ProfileBanner;
