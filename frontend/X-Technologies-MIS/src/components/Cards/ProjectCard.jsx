import moment from "moment";
import React from "react";
import { LuPaperclip, LuSettings } from "react-icons/lu";
import AvatarGroup from "../AvatarGroup";

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
  const getStatusTagColor = () => {
    switch (status) {
      case "On Hold":
        return "text-green-600 bg-green-100/70 border border-green-500/10";
      case "In Progress":
        return "text-cyan-600 bg-cyan-100/70 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };
  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
      </div>
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : status === "On Hold"
            ? "border-red-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>
      </div>
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <label className="text-xs text-gray-500">Start Date</label>
          <p className="text-[13px] font-medium text-gray-900">
            {moment(startDate).format("Do MMM YYYY")}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-500">end Date</label>
          <p className="text-[13px] font-medium text-gray-900">
            {endDate ? moment(endDate).format("Do MMM YYYY") : "Not Finished"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <AvatarGroup avatars={assignedEmployees || []} />
        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg mr-2">
            <LuPaperclip className="text-blue-500" />
            <span className="text-xs text-gray-900">{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
