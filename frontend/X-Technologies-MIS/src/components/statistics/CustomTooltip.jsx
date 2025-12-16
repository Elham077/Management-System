import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs font-semibold text-purple-700 mb-1">{name}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-medium text-gray-900">{value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
