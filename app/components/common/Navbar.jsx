"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { IoMdArrowForward } from "react-icons/io";
import ProfileBanner from "./ProfileBanner";
import Link from "next/link";

const Navbar = () => {
  const [showProfileBanner, setShowProfileBanner] = useState(false);

  // ✅ Get user & loading from Redux
  const { user, isLoading: isLoadingUser } = useSelector((state) => state.auth);

  // Sign out
  const handleSignOut = async () => {
    await signOut(auth);
    setShowProfileBanner(false);
  };

  return (
    <nav className="h-16 px-2 md:px-4 w-full border-b border-zinc-200/60 flex justify-between items-center relative">
      {/* logo */}
      <Link href="/" className="text-2xl font-semibold text-zinc-900">
        Talk2DB
      </Link>

      <div className="flex gap-2 md:gap-4 items-center">
      
        {/* Show "Sign In" button if no user */}
        {!user && !isLoadingUser && (
          <Link
            href="/signin"
            className="px-3 md:px-5 py-2 font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-full flex gap-2 items-center cursor-pointer transition-all duration-300"
          >
            Sign In
            <IoMdArrowForward />
          </Link>
        )}

        {/* loading state */}
        {isLoadingUser && (
          <div className="h-10 w-10 bg-zinc-300 rounded-full animate-pulse"></div>
        )}

        {/* Show user profile if logged in */}
        {user && (
          <Image
            src={user.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setShowProfileBanner((prev) => !prev)}
          />
        )}
      </div>

      {/* profile banner */}
      {user && showProfileBanner && (
        <ProfileBanner
          user={user}
          signOut={handleSignOut}
          onClose={() => setShowProfileBanner(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
