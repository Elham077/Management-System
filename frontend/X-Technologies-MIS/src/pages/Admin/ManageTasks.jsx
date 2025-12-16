import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { toast } from "react-toastify";

const ManageTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
      // More robust status summary mapping
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        {
          label: "Pending",
          count: statusSummary.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count: statusSummary.inProgressTasks || 0,
        },
        {
          label: "Completed",
          count: statusSummary.completedTasks || 0,
        },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };
  //down task Report
  const handleDownLoadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_TASKS_REPORT,
        {
          responseType: "blob",
        }
      );
      // create url for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details:", error);
      toast.error("Failed to download task details. please try again.");
    }
  };
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-semibold mb-4">
              Manage Tasks
            </h2>
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownLoadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
            <button
              onClick={() => navigate("/admin/create-task")}
              className="flex lg:hidden create-btn"
            >
              <LuPlus className="text-lg" />
              Create Task
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownLoadReport}
              >
                <LuFileSpreadsheet className="text-lg" /> Download Report
              </button>
              <button
                onClick={() => navigate("/admin/create-task")}
                className="hidden lg:flex create-btn"
              >
                <LuPlus className="text-lg" />
                Create Task
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachment?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default ManageTask;
