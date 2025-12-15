import React from 'react';
import './InfoCard.css';

const InfoCard = ({ label, value, color }) => {
  return (
    <div className="info-card">
      <div className="dot" style={{ backgroundColor: color }} />
      <p className="label-text">
        <span className="value">{value}</span> {label}
      </p>
    </div>
  );
};

export default InfoCard;