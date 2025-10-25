'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDbType } from '@/redux-store/dbConnectionsSlice';
import { SiMysql, SiMongodb } from "react-icons/si";
const DbTypeSelector = ({ availableDbTypes = ['mongodb', 'mysql'] }) => {
    const dispatch = useDispatch();
    const dbType = useSelector((state) => state.dbConnections.dbType);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dbIcons = {
        mongodb: <SiMongodb className="text-lg text-green-500" />,
        mysql: <SiMysql className="text-xl text-blue-600" />,
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (type) => {
        dispatch(setDbType(type));
        setIsOpen(false);
    };

    return (
        <div className="relative h-fit w-fit" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm font-semibold text-black bg-white border border-zinc-300 hover:bg-zinc-100 rounded-3xl flex gap-2 items-center cursor-pointer transition-all duration-300"
            >
                DB Engine: {dbIcons[dbType] || <SiMongodb className='text-lg text-green-500' />}
            </button>


            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-56 max-h-72 p-2 bg-white border border-gray-200 rounded-2xl shadow flex flex-col overflow-y-auto z-50">
                    {availableDbTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleSelect(type)}
                            className={`w-full px-3 py-2 text-start hover:bg-zinc-100 rounded-full cursor-pointer ${dbType === type ? 'font-semibold text-violet-600' : ''
                                }`}
                        >
                            {type.toUpperCase()}

                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DbTypeSelector;
