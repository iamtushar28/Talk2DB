"use client";
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; //google icon
import { BsGithub } from "react-icons/bs"; //git hub icon
import { FaSquareFacebook } from "react-icons/fa6"; //facebook icon
import SocialButton from "./SocialButton";

const page = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Redirecting after login
      router.push("/");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed. Try again.");
    }
  };

  const handleGithub = () => {
    alert("Github login clicked");
  };

  const handleFacebook = () => {
    alert("Facebook login clicked");
  };

  return (
    <div className="h-fit w-full py-28 px-2 flex gap-6 flex-col justify-center items-center">
      {/* heading */}
      <h2 className="text-3xl font-semibold mb-6">Sign In</h2>

      <SocialButton
        icon={FcGoogle}
        text="Continue with Google"
        onClick={handleGoogleLogin}
      />
      <SocialButton
        icon={BsGithub}
        text="Continue with Github"
        onClick={handleGithub}
      />
      <SocialButton
        icon={FaSquareFacebook}
        text="Continue with Facebook"
        iconColor="text-blue-600"
        onClick={handleFacebook}
      />
    </div>
  );
};

export default page;
