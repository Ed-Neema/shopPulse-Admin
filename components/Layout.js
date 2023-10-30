import React, { useState } from "react";
import { Inter, Barlow } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./Nav";
import Logo from "./Logo";
import Image from "next/image";
const barlow = Barlow({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div
        className={`main-div w-screen h-screen flex justify-center first-line:items-center ${barlow.className}`}
      >
        <div className="text-center flex flex-col justify-center items-center w-1/2 bg-black/70 ">
          <Image src="/Logo.png" width={200} height={500} alt="hero image" />
          <h1>Welcome to the ShopPulse Admin CMS Panel</h1>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 font-semibold hover:scale-110 transition bg-white p-2 px-4 rounded-lg border border-primary text-primary mt-4"
          >
            <Image
              src="/google.png"
              width={30}
              height={30}
              alt="google sign in image"
            />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={` w-screen h-screen flex flex-col md:flex-row ${barlow.className}`}
    >
      <div className="flex md:hidden items-center p-4">
        <button onClick={() => setShowNav(!showNav)} className=" z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex w-full">
        <Nav show={showNav} />
        <div className="bg-white flex-grow pt-4 px-8 rounded-lg mb-2">
          {children}
          {/* Logged in {session.user.email} */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
