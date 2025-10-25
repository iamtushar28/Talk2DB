"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import AuthProvider from "./AuthProvider";
import Navbar from "@/app/components/common/Navbar";

export default function ClientWrapper({ children }) {
    return (
        <Provider store={store}>
            <AuthProvider />
            <Navbar />
            {children}
        </Provider>
    );
}
