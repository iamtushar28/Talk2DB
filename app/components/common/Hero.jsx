'use client'
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDbConnections } from "@/redux-store/dbConnectionsSlice";

import QueryInputBox from "./QueryInputBox";
import GeneratedResponse from "./GeneratedResponse";
import Link from "next/link";

const Hero = () => {
    const dispatch = useDispatch();
    const { user, isLoading: isLoadingUser } = useSelector((state) => state.auth);
    const { selectedDb, isLoading } = useSelector((state) => state.dbConnections);

    // Fetch user's DB connections when user logs in or changes
    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchDbConnections(user.uid));
        }
    }, [user, dispatch]);

    return (
        <div className="w-full h-fit py-16 flex flex-col gap-10 justify-center items-center">
            {/* Page header */}
            <div className="flex flex-col justify-center items-center">
                <h4 className="text-2xl">Generate SQL Query</h4>
                <h4 className="text-lg text-zinc-600">
                    Turn everyday language into queries.
                </h4>
                <Link href={'/quick-guide'} className="ml-1 text-violet-500 hover:underline transition-all duration-300 cursor-pointer">
                    Quick guide.
                </Link>
            </div>

            {/* Query input & response section */}
            <div className="w-full px-4 flex flex-col md:flex-row justify-center gap-12 md:gap-6">
                {/* Query input form */}
                <QueryInputBox
                    user={user}
                    isConnected={!!selectedDb}
                    isLoadingConnection={isLoading}
                    isLoadingUser={isLoadingUser}
                />

                {/* Generated query output */}
                <GeneratedResponse
                    dbConnectionData={selectedDb}
                />
            </div>
        </div>
    );
};

export default Hero;
