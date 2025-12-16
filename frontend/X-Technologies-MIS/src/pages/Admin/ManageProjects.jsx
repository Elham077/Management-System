import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";
import ProjectStatusTabs from "../../components/ProjectStatusTabs";
import ProjectCard from "../../components/Cards/ProjectCard";
import "./ManageProjects.css";

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

  useEffect(() => {
    getAllProjects(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Projects">
      <div className="manage-projects-wrapper">
        <div className="page-header">
          <div className="page-title-wrapper">
            <h2 className="page-title">Manage Projects</h2>
            <button
              onClick={() => navigate("/admin/create-project")}
              className="create-btn lg:hidden"
            >
              <LuPlus className="text-lg" />
              Create Project
            </button>
          </div>

          {tabs?.length > 0 && (
            <div className="header-actions">
              <ProjectStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                onClick={() => navigate("/admin/create-project")}
                className="create-btn hidden lg:flex"
              >
                <LuPlus className="text-lg" />
                Create Project
              </button>
            </div>
          )}
        </div>

        <div className="projects-grid">
          {loading ? (
            <p className="loading-text">Loading projects...</p>
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
            <p className="empty-state">No projects found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageProjects;
