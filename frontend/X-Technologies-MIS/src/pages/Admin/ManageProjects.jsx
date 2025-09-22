import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";
import ProjectStatusTabs from "../../components/ProjectStatusTabs";
import ProjectCard from "../../components/Cards/ProjectCard";
// import { toast } from "react-toastify";

const ManageProjects = () => {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const getAllProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_ALL_PROJECTS,
        {
          params: {
            status: filterStatus === "All" ? "" : filterStatus,
          },
        }
      );

      const projects = response.data?.projects || response.data || [];
      setAllProjects(projects);

      // 🟢 نرمال‌سازی استتوس
      const normalizedStatuses = projects.map((p) =>
        p.status ? p.status.trim().toLowerCase() : ""
      );

      const statusArray = [
        { label: "All", count: projects.length },
        {
          label: "Not Started",
          count: normalizedStatuses.filter((s) => s === "not started").length,
        },
        {
          label: "In Progress",
          count: normalizedStatuses.filter((s) => s === "in progress").length,
        },
        {
          label: "On Hold",
          count: normalizedStatuses.filter((s) => s === "on hold").length,
        },
        {
          label: "Completed",
          count: normalizedStatuses.filter((s) => s === "completed").length,
        },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("There is no Project for return:", error);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (projectData) => {
    navigate(`/admin/create-project`, {
      state: { projectId: projectData._id },
    });
  };

  // // download report
  // const handleDownLoadReport = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       API_PATHS.REPORTS.EXPORT_PROJECTS_REPORT,
  //       {
  //         responseType: "blob",
  //       }
  //     );
  //     // create url for blob
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "project_details.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading projects details:", error);
  //     toast.error("Failed to download projects details. please try again.");
  //   }
  // };

  useEffect(() => {
    getAllProjects(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Projects">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-semibold mb-4">
              Manage Projects
            </h2>
            {/* <button
              className="flex lg:hidden download-btn"
              onClick={handleDownLoadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button> */}
            <button
              onClick={() => navigate("/admin/create-project")}
              className="flex lg:hidden create-btn"
            >
              <LuPlus className="text-lg" />
              Create Project
            </button>
          </div>

          {tabs?.length > 0 && (
            <div className="flex items-center gap-3">
              <ProjectStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              {/* <button
                className="hidden lg:flex download-btn"
                onClick={handleDownLoadReport}
              >
                <LuFileSpreadsheet className="text-lg" /> Download Report
              </button> */}
              <button
                onClick={() => navigate("/admin/create-project")}
                className="hidden lg:flex create-btn"
              >
                <LuPlus className="text-lg" />
                Create Project
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          {loading ? (
            <p className="col-span-3 text-center text-gray-500">
              Loading projects...
            </p>
          ) : allProjects && allProjects.length > 0 ? (
            allProjects.map((item) => (
              <ProjectCard
                key={item._id}
                title={item.title}
                description={item.description}
                status={item.status}
                startDate={item.startDate}
                endDate={item.endDate}
                assignedEmployees={
                  Array.isArray(item.assignedEmployees)
                    ? item.assignedEmployees.map(
                        (emp) => emp.profileImageUrl || ""
                      )
                    : []
                }
                attachmentCount={item.attachments?.length || 0}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageProjects;
