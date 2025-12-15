import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";
import "./SelectDropDown.css";

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
    <div ref={dropdownRef} className="dropdown-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button"
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="dropdown-icon">
          <LuChevronDown className={isOpen ? "open" : ""} />
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`dropdown-item ${
                option.value === value ? "selected" : ""
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
