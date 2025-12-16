import React from "react";
import UI_IMG from "../../assets/bg-img.jpeg";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-left">{children}</div>
      <div className="auth-right">
        <img src={UI_IMG} alt="UI_IMG" className="auth-image" />
      </div>
    </div>
  );
};

export default AuthLayout;