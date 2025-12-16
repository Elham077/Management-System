import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentInput from "../../components/inputs/AddAttachmentInput";
import { toast } from "react-toastify";
import Modal from "../../components/Model";
import DeleteAlert from "../../components/DeleteAlert";
import "./CreateTask.css";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachment: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachment: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
        attachment: taskData.attachment || [],
      });

      toast.success("Task created successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
      toast.error("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === item.text || item
        );
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
        attachment: taskData.attachment || [],
      });
      toast.success("Task Updated Successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error Updating Task", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      const msg = "Task title is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!taskData.description.trim()) {
      const msg = "Task description is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!taskData.dueDate) {
      const msg = "Due date is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (taskData.assignedTo.length === 0) {
      const msg = "Please assign the task to at least one user";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (taskData.todoChecklist.length === 0) {
      const msg = "Please add at least one todo item";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachment: taskInfo?.attachment || [],
        });
      }
    } catch (error) {
      console.error("Error Fetching Task: ", error);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task Deleted Successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error Deleting Task", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="create-task-wrapper">
        <div className="form-grid">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">
                {taskId ? "Update Task" : "Create New Task"}
              </h2>
              {taskId && (
                <button
                  className="delete-btn"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            {/* title */}
            <div className="mt-4">
              <label className="form-label">Task Title</label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            {/* description */}
            <div className="mt-3">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Describe task"
                className="form-input form-textarea"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            {/* priority + dueDate + assignTo */}
            <div className="form-grid-inner">
              <div className="col-span-6 sm:col-span-4">
                <label className="form-label">Priority</label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-3 md:col-span-4">
                <label className="form-label">Due Date</label>
                <input
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) => {
                    handleValueChange("dueDate", target.value);
                  }}
                  type="date"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="form-label">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            {/* todo list */}
            <div className="mt-3">
              <label className="form-label">TODO Checklist</label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            {/* attachment */}
            <div className="mt-3">
              <label className="form-label">Add Attachment</label>
              <AddAttachmentInput
                attachment={taskData?.attachment}
                setAttachment={(value) =>
                  handleValueChange("attachment", value)
                }
              />
            </div>

            {/* error */}
            {error && <p className="error-text">{error}</p>}

            {/* button */}
            <div className="flex items-center justify-end mt-7">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* delete alert */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
