"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../authSlice";

/**
 * AuthProvider Component
 * ----------------------
 * Sets up a Firebase authentication listener and updates the Redux store
 * with the current user state. This component does not render UI; it only
 * handles authentication state management.
 */
const AuthProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Indicate that authentication check is in progress
    dispatch(setLoading(true));

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Only store serializable fields in Redux
        const serializableUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        dispatch(setUser(serializableUser)); // Update Redux with user
      } else {
        dispatch(clearUser()); // Clear Redux if no user is logged in
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [dispatch]);

  return null; // Component does not render any UI
};

export default AuthProvider;
