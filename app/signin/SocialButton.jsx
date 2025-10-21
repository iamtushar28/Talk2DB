import React from "react";

const SocialButton = ({ icon: Icon, text, onClick, iconColor, borderColor }) => {
  return (
    <button
      onClick={onClick}
      className={`h-12 w-full md:w-[45%] border rounded hover:bg-zinc-100 text-center text-sm font-semibold relative transition-all duration-200 flex items-center justify-center cursor-pointer`}
      style={{ borderColor: borderColor || "#d4d4d8" }} // default zinc-300
    >
      <Icon
        className={`absolute left-4 text-2xl ${iconColor ? iconColor : ""}`}
      />
      {text}
    </button>
  );
};

export default SocialButton;
