import React, { useState } from "react";
import { LuUser, LuClock, LuLoader, LuCheckCheck } from "react-icons/lu";

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
      className={`user-card ${
        expandable
          ? "cursor-pointer hover:shadow-lg transition-all duration-300"
          : ""
      } ${isExpanded ? "expanded" : ""}`}
      onClick={toggleExpand}
    >
      <div className="">
        <div className="flex items-center gap-3">
          {userInfo?.profileImageUrl ? (
            <img
              src={userInfo.profileImageUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <LuUser className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {userInfo?.name || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">
              {userInfo?.email || "No email provided"}
            </p>
          </div>
        </div>

        {totalTasks > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Task Progress</span>
              <span>
                {userInfo?.completedTasks || 0}/{totalTasks} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{
                  width: `${((userInfo?.completedTasks || 0) / totalTasks) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-3 mt-5">
          <StatCard
            label="Pending"
            count={userInfo?.pendingTasks || 0}
            status="Pending"
            icon={<LuClock className="w-3 h-3" />}
          />
          <StatCard
            label="In Progress"
            count={userInfo?.inProgressTasks || 0}
            status="In Progress"
            icon={<LuLoader className="w-3 h-3" />}
          />
          <StatCard
            label="Completed"
            count={userInfo?.completedTasks || 0}
            status="Completed"
            icon={<LuCheckCheck className="w-3 h-3" />}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status, icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case "In Progress":
        return {
          bg: "bg-cyan-50",
          text: "text-cyan-700",
          border: "border-cyan-200",
        };
      case "Completed":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
        };
      default:
        return {
          bg: "bg-violet-50",
          text: "text-violet-700",
          border: "border-violet-200",
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg border ${colors.border} ${colors.bg} transition-all hover:scale-105 w-full`}
    >
      <div className="flex items-center gap-1">
        <span className={`${colors.text}`}>{icon}</span>
        <span className={`text-sm font-semibold ${colors.text}`}>{count}</span>
      </div>
      <span className={`text-xs font-medium ${colors.text} mt-1`}>{label}</span>
    </div>
  );
};
