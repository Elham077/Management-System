import React from "react";
import UI_IMG from "../../assets/bg-img.jpeg";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w[60vw] px-12 pt-8 pb-12">
        {/* <h2 className="text-lg font-medium text-black">Task Management</h2> */}
        {children}
      </div>
      <div className="hidden md:flex w-[50vw] h-screen items-center justify-center bg-white bg-cover bg-center overflow-hidden">
        <img src={UI_IMG} alt="UI_IMG" className="w-64 lg:w-[90%] " />
      </div>
    </div>
  );
};

export default AuthLayout;
