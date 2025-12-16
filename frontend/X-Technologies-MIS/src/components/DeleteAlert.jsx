import React from "react";
import "./DeleteAlert.css";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="delete-alert-wrapper">
      <p className="delete-alert-text">{content}</p>
      <div className="delete-actions">
        <button className="delete-btn" type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
