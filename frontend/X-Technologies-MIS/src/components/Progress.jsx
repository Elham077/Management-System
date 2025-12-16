import React from "react";
import "./Progress.css";

const Progress = ({ progress, status }) => {
  const getColorClass = () => {
    switch (status) {
      case "In Progress":
        return "in-progress";
      case "Completed":
        return "completed";
      default:
        return "default";
    }
  };

  return (
    <div className="progress-container">
      <div
        className={`progress-bar ${getColorClass()}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress; 