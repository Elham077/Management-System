import React from "react";
import UI_IMG from "../../assets/Bg-img.png";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Left content */}
      <div className="auth-left">{children}</div>

      {/* Right image */}
      <div className="auth-right">
        <img src={UI_IMG} alt="UI Illustration" className="auth-image" />
      </div>
    </div>
  );
};

export default AuthLayout;
