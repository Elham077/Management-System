import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-wrapper">
      <div className={`input-container ${error ? "error" : ""}`}>
        <input
          id={label}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          className="input-field"
          autoComplete={isPassword ? "current-password" : "off"}
        />
        <label htmlFor={label} className="input-label">
          {label}
        </label>
        {isPassword && (
          <div onClick={toggleShowPassword} className="password-toggle">
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input;
