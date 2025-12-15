import React from "react";
import moment from "moment";
import { LuPaperclip } from "react-icons/lu";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import "./TaskCard.css";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagClass = () => {
    switch (status) {
      case "In Progress":
        return "status-tag in-progress";
      case "Completed":
        return "status-tag completed";
      default:
        return "status-tag default";
    }
  };

  const getPriorityTagClass = () => {
    switch (priority) {
      case "Low":
        return "priority-tag low";
      case "Medium":
        return "priority-tag medium";
      default:
        return "priority-tag high";
    }
  };

  const getBorderClass = () => {
    switch (status) {
      case "In Progress":
        return "content-section in-progress";
      case "Completed":
        return "content-section completed";
      default:
        return "content-section default";
    }
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="flex items-end gap-3 px-4">
        <div className={getStatusTagClass()}>{status}</div>
        <div className={getPriorityTagClass()}>{priority} Priority</div>
      </div>

      <div className={getBorderClass()}>
        <p className="title">{title}</p>
        <p className="description">{description}</p>
        <p className="task-done">
          Task Done:{" "}
          <strong>
            {completedTodoCount}/ {todoChecklist?.length || 0}
          </strong>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      <div className="date-section">
        <div className="date-row">
          <label className="date-label">Start Date</label>
          <p className="date-value">{moment(createAt).format("Do MMM YYYY")}</p>
        </div>
        <div className="date-row">
          <label className="date-label">Due Date</label>
          <p className="date-value">{moment(dueDate).format("Do MMM YYYY")}</p>
        </div>
      </div>

      <div className="footer">
        <AvatarGroup avatars={assignedTo || []} />
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

export default TaskCard;
