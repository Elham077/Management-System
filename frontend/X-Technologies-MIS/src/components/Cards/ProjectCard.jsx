import moment from "moment";
import React from "react";
import { LuPaperclip } from "react-icons/lu";
import AvatarGroup from "../AvatarGroup";
import "./ProjectCard.css";

const ProjectCard = ({
  title,
  description,
  status,
  startDate,
  endDate,
  assignedEmployees = [],
  attachmentCount = 0,
  onClick,
}) => {
  const getStatusTagClass = () => {
    switch (status) {
      case "On Hold":
        return "status-tag on-hold";
      case "In Progress":
        return "status-tag in-progress";
      case "Completed":
        return "status-tag completed";
      default:
        return "status-tag default";
    }
  };

  const getBorderClass = () => {
    switch (status) {
      case "In Progress":
        return "content-section in-progress";
      case "Completed":
        return "content-section completed";
      case "On Hold":
        return "content-section on-hold";
      default:
        return "content-section default";
    }
  };

  return (
    <div className="project-card" onClick={onClick}>
      <div className="flex items-end gap-3 px-4">
        <div className={getStatusTagClass()}>{status}</div>
      </div>

      <div className={getBorderClass()}>
        <p className="title">{title}</p>
        <p className="description">{description}</p>
      </div>

      <div className="date-section">
        <div className="date-row">
          <label className="date-label">Start Date</label>
          <p className="date-value">
            {moment(startDate).format("Do MMM YYYY")}
          </p>
        </div>
        <div className="date-row">
          <label className="date-label">End Date</label>
          <p className="date-value">
            {endDate ? moment(endDate).format("Do MMM YYYY") : "Not Finished"}
          </p>
        </div>
      </div>

      <div className="footer">
        <AvatarGroup avatars={assignedEmployees || []} />
        {attachmentCount > 0 && (
          <div className="attachment-box">
            <LuPaperclip className="attachment-icon" />
            <span className="attachment-count">{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
