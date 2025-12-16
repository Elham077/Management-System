import React from "react";
import "./CustomLegend.css";

const CustomLegend = ({ payload }) => {
  return (
    <div className="legend-container">
      {payload.map((entry, index) => (
        <div key={`Legend-${index}`} className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="legend-label">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;