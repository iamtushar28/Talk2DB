"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../authSlice";

const AuthProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Only store serializable fields
        const serializableUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        dispatch(setUser(serializableUser));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null; // No UI — just sets up listener
};

export default AuthProvider;
