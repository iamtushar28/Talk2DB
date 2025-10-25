'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SiMongodb } from "react-icons/si";
import { setSelectedDb } from '@/redux-store/dbConnectionsSlice';

const MongoDbSelector = () => {
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
        dispatch(setSelectedDb(db)); // ✅ update Redux state
        setIsOpen(false);
    };

    return (
        <div className="w-fit h-fit relative" ref={dropdownRef}>
            {/* Selected DB */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="pl-2 pr-3 py-2 text-sm font-semibold text-black rounded-full flex gap-1 items-center border border-gray-200 cursor-pointer"
            >
                <SiMongodb className="text-xl text-green-600" />
                MongoDB: {selectedDb?.dbName || 'Select DB'}
            </div>

            {/* Dropdown list */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-56 max-h-72 p-2 bg-white border border-gray-200 rounded-2xl shadow flex flex-col overflow-y-auto z-50">
                    {connections.map((db) => (
                        <button
                            key={db.id}
                            onClick={() => handleSelect(db)}
                            className="w-full px-3 py-2 text-start hover:bg-zinc-100 rounded-full cursor-pointer"
                        >
                            {db.dbName}
                        </button>
                    ))}
                    {connections.length === 0 && (
                        <div className="px-3 py-2 text-zinc-500">No connections available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MongoDbSelector;
