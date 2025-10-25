import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { FaRegUserCircle } from "react-icons/fa";

const ProfileBanner = ({ user, onClose, signOut }) => {

    const profileOptions = [
        {
            label: "Dashboard",
            link: "/"
        },
        {
            label: "Settings",
            link: "/"
        },
        {
            label: "Subscriptions",
            link: "/"
        },
    ];

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
            className="w-72 h-fit p-3 bg-white shadow-lg border border-zinc-300 rounded-2xl absolute top-[58px] right-4 z-50"
        >
            {/* user email */}
            <p className="font-semibold max-w-72 truncate flex gap-1 items-center">
                <FaRegUserCircle />
                {user.displayName}
            </p>

            {/* divider */}
            <div className="w-full h-[0.6px] mt-2 mb-2 bg-zinc-200"></div>

            {/* profile options */}
            {profileOptions.map((option, index) => (
                <Link
                    key={index}
                    href={option.link}
                    className="w-full pl-3 py-2 text-start hover:bg-zinc-100 rounded-full transition-all duration-300 cursor-pointer block"
                >
                    {option.label}
                </Link>
            ))}

            {/* sign out */}
            <button
                onClick={signOut}
                className="w-full pl-3 py-2 text-start hover:bg-zinc-100 rounded-full transition-all duration-300 cursor-pointer block"
            >
                Sign Out
            </button>

        </div>
    );
};

export default ProfileBanner;
