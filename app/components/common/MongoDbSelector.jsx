'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SiMongodb } from "react-icons/si";

const MongoDbSelector = ({ dbConnections = [], selectedDb, setSelectedDb }) => {
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
        setSelectedDb(db);
        setIsOpen(false);
    };

    return (
        <div className="w-fit h-fit relative" ref={dropdownRef}>
            {/* Selected DB */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="pl-2 pr-3 py-2 text-sm font-semibold text-black rounded-lg flex gap-1 items-center border border-gray-200 cursor-pointer"
            >
                <SiMongodb className="text-xl text-green-600" />
                MongoDB: {selectedDb?.dbName}
            </div>

            {/* Dropdown list */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-56 max-h-72 p-2 bg-white border border-gray-200 rounded-lg shadow flex flex-col overflow-y-auto z-50">
                    {dbConnections.map((db) => (
                        <button
                            key={db.id}
                            onClick={() => handleSelect(db)}
                            className="w-full px-3 py-2 text-start hover:bg-zinc-100 rounded-lg cursor-pointer"
                        >
                            {db.dbName}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
};

export default MongoDbSelector;
