import React from "react";
import UI_IMG from "../../assets/Bg-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left content */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        {children}
      </div>

      {/* Right image */}
      <div className="hidden md:flex w-[50vw] h-screen items-center justify-center">
        <img
          src={UI_IMG}
          alt="UI Illustration"
          className="max-w-[90%] max-h-[90%] object-contain shadow-2xl rounded-lg"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
