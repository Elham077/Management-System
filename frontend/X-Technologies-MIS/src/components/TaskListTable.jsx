import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-500 border border-red-200";
      case "InProgress":
        return "bg-gray-100 text-gray-500 border border-gray-200";
      case "Completed":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
    }
  };
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-500 border border-yellow-200";
      case "High":
        return "bg-red-100 text-red-500 border border-red-200";
      default:
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg mt-3">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-sm">
              Name
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-sm">
              Status
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-sm">
              Priority
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-sm hidden md:table-cell">
              Created on
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr
              key={task._id}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td
                className="px-4 py-3 text-gray-700 text-sm truncate"
                title={task.title}
              >
                {task.title}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap hidden md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM, YYYY")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
