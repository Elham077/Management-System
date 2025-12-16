import React from "react";
import "./CustomTooltip.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    return (
      <div className="tooltip-box">
        <p className="tooltip-title">{name}</p>
        <p className="tooltip-text">
          Count: <span>{value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
