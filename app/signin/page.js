"use client";
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; //google icon
import { BsGithub } from "react-icons/bs"; //git hub icon
import { FaSquareFacebook } from "react-icons/fa6"; //facebook icon
import SocialButton from "./SocialButton";

/**
 * Renders the social sign-in page.
 */
const page = () => {
  // Hook to handle client-side routing.
  const router = useRouter();

  /**
   * Handles the Google sign-in process via Firebase popup.
   * Redirects to the homepage on success.
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Redirecting after successful login
      router.push("/");
    } catch (error) {
      // Logs the error and notifies the user.
      console.error("Google login failed:", error);
      alert("Login failed. Try again.");
    }
  };

  /**
   * Placeholder handler for Github login button.
   */
  const handleGithub = () => {
    alert("Github login clicked");
  };

  /**
   * Placeholder handler for Facebook login button.
   */
  const handleFacebook = () => {
    alert("Facebook login clicked");
  };

  // Main component render structure.
  return (
    <div className="h-fit w-full py-28 px-2 flex gap-6 flex-col justify-center items-center">
      {/* heading */}
      <h2 className="text-3xl font-semibold mb-6">Sign In</h2>

      {/* Google Sign In Button */}
      <SocialButton
        icon={FcGoogle}
        text="Continue with Google"
        onClick={handleGoogleLogin}
      />
      {/* Github Sign In Button */}
      <SocialButton
        icon={BsGithub}
        text="Continue with Github"
        onClick={handleGithub}
      />
      {/* Facebook Sign In Button */}
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
