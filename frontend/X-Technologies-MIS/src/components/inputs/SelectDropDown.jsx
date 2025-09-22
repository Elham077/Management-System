import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropDown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* DropDown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black outline-none bg-white border border-slate-200 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center hover:border-slate-400"
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2 transition-transform">
          <LuChevronDown className={isOpen ? "rotate-180" : ""} />
        </span>
      </button>

      {/* DropDown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-200 rounded-md mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-3 py-2 text-sm cursor-pointer 
                ${
                  option.value === value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
