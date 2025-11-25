'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDb } from '@/redux-store/dbConnectionsSlice';
import Link from 'next/link';
import { SiMongodb, SiMysql } from "react-icons/si";
import { IoAddSharp } from "react-icons/io5";

// rendering database icons based on database types
const DB_TYPE_CONFIG = {
    mysql: {
        icon: <SiMysql className="text-xl text-blue-600" />,
        border: "border-blue-200",
        headerIcon: <SiMysql className="text-xl text-blue-600" />
    },
    mongodb: {
        icon: <SiMongodb className="text-green-600" />,
        border: "border-green-200",
        headerIcon: <SiMongodb className="text-green-600" />
    },
};

const DbSelector = () => {

    // handling redux state for update selected database
    const dispatch = useDispatch();
    const { connections, selectedDb } = useSelector((state) => state.dbConnections);

    // handling dropdown states
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // update redux state for selected database
    const handleSelect = (db) => {
        dispatch(setSelectedDb(db));
        setIsOpen(false);
    };

    // Render icon for the selected DB only
    const renderSelectedIcon = (dbType) => {
        return DB_TYPE_CONFIG[dbType]?.icon || <SiMongodb className="text-xl text-green-600" />;
    };

    // Group databases by type
    const grouped = connections.reduce((acc, db) => {
        const type = db.dbType?.toLowerCase() || "unknown";
        if (!acc[type]) acc[type] = [];
        acc[type].push(db);
        return acc;
    }, {});

    return (
        <div className="w-fit h-fit relative" ref={dropdownRef}>
            {/* Selected DB */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 max-w-60 text-sm capitalize font-semibold text-black rounded-full flex gap-2 items-center border border-gray-200 cursor-pointer"
            >
                <span>{renderSelectedIcon(selectedDb?.dbType)}</span>

                <p className='max-w-52 truncate'>
                    {selectedDb?.dbName || 'Select DB'}
                </p>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 max-h-60 p-2 bg-white border border-gray-200 rounded-2xl shadow flex flex-col overflow-y-auto z-50">

                    {Object.keys(grouped).map(type => {
                        const config = DB_TYPE_CONFIG[type];
                        if (!config) return null; // ignore unknown db types unless desired

                        return (
                            <div key={type}>
                                {/* Section Header */}
                                <div className="w-full px-3 py-1 flex gap-2 items-center">
                                    {config.headerIcon}
                                    <div className={`w-[80%] h-[0.2px] border rounded-full ${config.border}`}></div>
                                </div>

                                {/* DB items (no icons) */}
                                {grouped[type].map(db => (
                                    <button
                                        key={db.id}
                                        onClick={() => handleSelect(db)}
                                        className="w-full px-3 py-2 text-start hover:bg-zinc-100 rounded-full cursor-pointer"
                                    >
                                        <p className="truncate text-sm capitalize">{db.dbName}</p>
                                    </button>
                                ))}
                            </div>
                        );
                    })}

                    {/* Add new DB */}
                    <Link
                        href={'/connect'}
                        className="w-full px-3 py-2 mt-1 text-sm text-center bg-zinc-100 hover:bg-zinc-50 rounded-full cursor-pointer flex justify-center items-center gap-2 transition-all duration-200"
                    >
                        <IoAddSharp />
                        Add DB
                    </Link>

                    {connections.length === 0 && (
                        <div className="px-3 py-2 text-zinc-500">No connections available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DbSelector;
