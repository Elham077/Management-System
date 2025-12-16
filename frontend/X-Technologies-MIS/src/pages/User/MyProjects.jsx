import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ProjectStatusTabs from "../../components/ProjectStatusTabs";
import ProjectCard from "../../components/Cards/ProjectCard";
import "./ManageProjectsUser.css";

const ManageProjectsUser = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const getAllProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_ALL_PROJECTS
      );
      const projects = response.data || [];
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
      console.error("Error fetching projects:", error);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (projectData) => {
    alert(`Project: ${projectData.title}`);
  };

  useEffect(() => {
    getAllProjects();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Projects">
      <div className="manage-projects-user-wrapper">
        <div className="page-header">
          <h2 className="page-title">My Projects</h2>

          {tabs?.length > 0 && (
            <div className="flex items-center gap-3">
              <ProjectStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
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
                isReadOnly={true}
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

export default ManageProjectsUser;
