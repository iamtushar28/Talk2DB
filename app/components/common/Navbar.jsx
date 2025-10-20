'use client'
import React, { useState } from "react";
import UiButton from "../ui/UiButton";
import { IoMdArrowForward } from "react-icons/io";
import { IoRocket } from "react-icons/io5";
import ProfileBanner from "./ProfileBanner";

const Navbar = () => {
  const [showProfileBanner, setShowProfileBanner] = useState(false);

  const profileOptions = [
    { label: "Dashboard", onClick: () => console.log("Dashboard clicked") },
    { label: "Settings", onClick: () => console.log("Settings clicked") },
    { label: "Subscriptions", onClick: () => console.log("Subscriptions clicked") },
    { label: "Log Out", onClick: () => console.log("Log Out clicked") },
  ];

  return (
    <nav className="h-16 px-4 w-full border-b border-zinc-200/60 flex justify-between items-center relative">
      {/* logo */}
      <h2 className="text-2xl font-semibold text-zinc-900">Talk2DB</h2>

      <div className="flex gap-4 items-center">
        {/* sign in button */}
        <UiButton title={"Sign In"} icon={<IoMdArrowForward />} />

        {/* go pro button */}
        {/* <UiButton title={'Go Pro'} icon={<IoRocket />} /> */}

        {/* user profile icon */}
        <div
          className="h-10 w-10 bg-zinc-200 rounded-full cursor-pointer"
          onClick={() => setShowProfileBanner((prev) => !prev)}
        ></div>
      </div>

      {/* profile banner */}
      {showProfileBanner && (
        <ProfileBanner
          email="tusharsuryawanshi2232@gmail.com"
          options={profileOptions}
          onClose={() => setShowProfileBanner(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
