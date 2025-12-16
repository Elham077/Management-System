/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { PRIORITY_DATA, PROJECT_STATUS_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import SelectUsers from "../../components/inputs/SelectUsers";
import AddAttachmentInput from "../../components/inputs/AddAttachmentInput";
import { toast } from "react-toastify";
import Modal from "../../components/Model";
import DeleteAlert from "../../components/DeleteAlert";

const CreateEditProject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = location.state || {};

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    technologies: [],
    status: "Not Started",
    startDate: "",
    endDate: "",
    assignedEmployees: [],
    attachments: [],
  });

  const [currentProject, setCurrentProject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setProjectData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setProjectData({
      title: "",
      description: "",
      technologies: [],
      status: "Not Started",
      startDate: "",
      endDate: "",
      assignedEmployees: [],
      attachments: [],
    });
  };

  // create project
  const createProject = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.PROJECTS.CREATE_PROJECT, {
        ...projectData,
        startDate: projectData.startDate
          ? new Date(projectData.startDate).toISOString()
          : null,
        endDate: projectData.endDate
          ? new Date(projectData.endDate).toISOString()
          : null,
      });

      toast.success("Project created successfully");
      clearData();
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  // update project
  const updateProject = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.PROJECTS.UPDATE_PROJECT(projectId), {
        ...projectData,
        startDate: projectData.startDate
          ? new Date(projectData.startDate).toISOString()
          : null,
        endDate: projectData.endDate
          ? new Date(projectData.endDate).toISOString()
          : null,
      });
      toast.success("Project Updated Successfully");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error Updating Project", error);
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };
  // handle submit
  const handleSubmit = async () => {
    setError(null);

    if (!projectData.title.trim()) {
      const msg = "Project title is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!projectData.description.trim()) {
      const msg = "Project description is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!projectData.startDate) {
      const msg = "Start date is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!projectData.endDate) {
      const msg = "End date is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!projectData.technologies) {
      const msg = "Development Technologies is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (projectData.assignedEmployees.length === 0) {
      const msg = "Please assign at least one employee";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (projectId) {
      updateProject(projectId);
      return;
    }
    createProject();
  };

  // get project info by ID
  const getProjectDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_PROJECT_BY_ID(projectId)
      );

      if (response.data) {
        const proj = response.data;
        setCurrentProject(proj);
        setProjectData({
          title: proj.title || "",
          description: proj.description || "",
          technologies: proj.technologies || "",
          status: proj.status || "Not Started",
          startDate: proj.startDate
            ? moment(proj.startDate).format("YYYY-MM-DD")
            : "",
          endDate: proj.endDate
            ? moment(proj.endDate).format("YYYY-MM-DD")
            : "",
          assignedEmployees: proj?.assignedEmployees?.map((u) => u?._id) || [],
          attachments: proj?.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error Fetching Project: ", error);
    }
  };

  const deleteProject = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectId));
      setOpenDeleteAlert(false);
      toast.success("Project Deleted Successfully");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error Deleting Project", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProjectDetailsById(projectId);
    }
  }, [projectId]);

  return (
    <DashboardLayout activeMenu="Create Project">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 py-7">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium ">
                {projectId ? "Update Project" : "Create New Project"}
              </h2>
              {projectId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            {/* title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Project Title
              </label>
              <input
                placeholder="Enter Project Title"
                className="form-input"
                value={projectData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            {/* description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe project"
                className="form-input"
                rows={4}
                value={projectData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Development Technologies
              </label>
              <input
                placeholder="Enter Project Development Technologies"
                className="form-input"
                value={projectData.technologies}
                onChange={({ target }) =>
                  handleValueChange("technologies", target.value)
                }
              />
            </div>
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 sm:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Status
                </label>
                <SelectDropDown
                  options={PROJECT_STATUS_DATA}
                  value={projectData.status}
                  onChange={(value) => handleValueChange("status", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-3 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Start Date
                </label>
                <input
                  className="form-input"
                  value={projectData.startDate}
                  onChange={({ target }) =>
                    handleValueChange("startDate", target.value)
                  }
                  type="date"
                />
              </div>
              <div className="col-span-3 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  End Date
                </label>
                <input
                  className="form-input"
                  value={projectData.endDate}
                  onChange={({ target }) =>
                    handleValueChange("endDate", target.value)
                  }
                  type="date"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="text-xs font-medium text-slate-600">
                  Assigned Employees
                </label>
                <SelectUsers
                  selectedUsers={projectData.assignedEmployees}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedEmployees", value)
                  }
                />
              </div>
            </div>

            {/* attachment */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentInput
                attachment={projectData.attachments}
                setAttachment={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {/* button */}
            <div className="flex items-center justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {projectId ? "UPDATE PROJECT" : "CREATE PROJECT"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* delete alert */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Project"
      >
        <DeleteAlert
          content="Are you sure you want to delete this project?"
          onDelete={() => deleteProject()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateEditProject;
