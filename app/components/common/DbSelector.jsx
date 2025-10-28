'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDb } from '@/redux-store/dbConnectionsSlice';
import Link from 'next/link';
import { SiMongodb, SiMysql } from "react-icons/si";
import { IoAddSharp } from "react-icons/io5";

const DbSelector = () => {
    const dispatch = useDispatch();
    const { connections, selectedDb } = useSelector((state) => state.dbConnections);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (db) => {
        dispatch(setSelectedDb(db)); // update Redux state
        setIsOpen(false);
    };

    // Determine icon based on DB type
    const renderDbIcon = (dbType) => {
        switch (dbType?.toLowerCase()) {
            case 'mysql':
                return <SiMysql className="text-2xl text-blue-600" />;
            case 'mongodb':
            default:
                return <SiMongodb className="text-xl text-green-600" />;
        }
    };

    return (
        <div className="w-fit h-fit relative" ref={dropdownRef}>
            {/* Selected DB */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 max-w-60 text-sm capitalize font-semibold text-black rounded-full flex gap-2 items-center border border-gray-200 cursor-pointer"
            >
                {/* dbtypy icon */}
                <span>
                    {renderDbIcon(selectedDb?.dbType)}
                </span>
                {/* db name */}
                <p className='max-w-52 truncate'>
                    {selectedDb?.dbName || 'Select DB'}
                </p>
            </div>

            {/* Dropdown list */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 max-h-60 p-2 bg-white border border-gray-200 rounded-2xl shadow flex flex-col overflow-y-auto z-50">
                    {connections.map((db) => (
                        <button
                            key={db.id}
                            onClick={() => handleSelect(db)}
                            className="w-full px-3 py-2 text-start hover:bg-zinc-100 rounded-full cursor-pointer flex items-center gap-2"
                        >
                            {/* dbtypy icon */}
                            <span className='min-h-6 min-w-6'>
                                {renderDbIcon(db.dbType)}
                            </span>
                            {/* db name */}
                            <p className='max-w-44 truncate text-sm'>
                                {db.dbName}
                            </p>
                        </button>
                    ))}
                    {/* add databse redirect link */}
                    <Link
                        href={'/connect'}
                        className="w-full px-3 py-2 text-start text-sm hover:bg-zinc-100 rounded-full cursor-pointer flex items-center gap-2"
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
