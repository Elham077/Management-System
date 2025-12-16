import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

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

  const isFocusedOrFilled = value && value.length > 0;

  return (
    <div className="relative w-full mb-6">
      {/* Input field */}
      <div
        className={`flex items-center border rounded-md px-3 py-3 bg-white transition-all duration-200 ${
          error ? "border-red-500" : "border-gray-300"
        } focus-within:ring-2 focus-within:ring-primary`}
      >
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          id={label}
          placeholder={placeholder || " "}
          className="w-full bg-transparent outline-none text-sm peer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={type === "password" ? "current-password" : "off"}
        />
        {type === "password" && (
          <div
            onClick={toggleShowPassword}
            className="ml-2 text-slate-400 cursor-pointer transition duration-200 hover:text-primary"
          >
            {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
          </div>
        )}
      </div>

      {/* Floating label */}
      <label
        htmlFor={label}
        className={`absolute left-3 text-slate-500 text-sm transition-all duration-200
          ${isFocusedOrFilled ? "-top-2 text-xs text-primary bg-white px-1" : "top-3"}
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500`}
      >
        {label}
      </label>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
