import React from "react";
import moment from "moment";
import "./TaskListTable.css";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "badge-red";
      case "InProgress":
        return "badge-gray";
      case "Completed":
        return "badge-green";
      default:
        return "badge-cyan";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Low":
        return "badge-green";
      case "Medium":
        return "badge-yellow";
      case "High":
        return "badge-red";
      default:
        return "badge-cyan";
    }
  };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead className="thead">
          <tr className="thead-row">
            <th className="th">Name</th>
            <th className="th">Status</th>
            <th className="th">Priority</th>
            <th className="th hidden-md">Created on</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="tbody-row">
              <td className="td truncate" title={task.title}>
                {task.title}
              </td>
              <td className="td">
                <span className={`badge ${getStatusBadgeColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="td">
                <span
                  className={`badge ${getPriorityBadgeColor(task.priority)}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="td nowrap hidden-md">
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
