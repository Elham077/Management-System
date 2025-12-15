import React, { useState } from "react";
import { LuUser, LuClock, LuLoader, LuCheckCheck } from "react-icons/lu";
import "./UserCard.css";

const UserCard = ({ userInfo, expandable = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const totalTasks =
    (userInfo?.pendingTasks || 0) +
    (userInfo?.inProgressTasks || 0) +
    (userInfo?.completedTasks || 0);

  return (
    <div
      className={`user-card ${expandable ? "expandable" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={toggleExpand}
    >
      <div className="user-header">
        {userInfo?.profileImageUrl ? (
          <img
            src={userInfo.profileImageUrl}
            alt="Avatar"
            className="avatar-img"
          />
        ) : (
          <div className="avatar-fallback">
            <LuUser className="avatar-icon" />
          </div>
        )}
        <div className="user-info">
          <p className="name">{userInfo?.name || "Unknown User"}</p>
          <p className="email">{userInfo?.email || "No email provided"}</p>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="task-progress">
          <div className="progress-header">
            <span>Task Progress</span>
            <span>
              {userInfo?.completedTasks || 0}/{totalTasks} completed
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((userInfo?.completedTasks || 0) / totalTasks) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="stat-row">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
          icon={<LuClock className="stat-icon" />}
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="in-progress"
          icon={<LuLoader className="stat-icon" />}
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="completed"
          icon={<LuCheckCheck className="stat-icon" />}
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, count, status, icon }) => {
  return (
    <div className={`stat-card ${status}`}>
      <div className="flex items-center gap-1">
        <span>{icon}</span>
        <span className="stat-count">{count}</span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default UserCard;