/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import moment from "moment";
import { LuSquareArrowUpRight } from "react-icons/lu";
import "./ViewTaskDetails.css";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "in-progress";
      case "Completed":
        return "completed";
      default:
        return "default";
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(`/api/tasks/${id}`);
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Can't find task with this ID", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const updatedChecklist = [...(task?.todoChecklist ?? [])];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    setTask((prev) => ({
      ...prev,
      todoChecklist: updatedChecklist,
    }));

    try {
      const response = await axiosInstance.put(`/api/tasks/${id}/todo`, {
        todoChecklist: updatedChecklist,
      });

      if (response.status === 200) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating checklist", error);

      updatedChecklist[index].completed = !updatedChecklist[index].completed;
      setTask((prev) => ({
        ...prev,
        todoChecklist: updatedChecklist,
      }));
    }
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="task-details-wrapper">
        {task && (
          <div className="form-grid">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">{task?.title}</h2>
                <div className={`status-tag ${getStatusTagColor(task?.status)}`}>
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="form-grid-inner mt-4">
                <div>
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div>
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MM YYYY")
                        : "N/A"
                    }
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="todo-label">Todo Checklist</label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachment?.length > 0 && (
                <div className="mt-2">
                  <label className="attachment-label">Attachments</label>
                  {task.attachment.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="info-box-label">{label}</label>
      <p className="info-box-value">{value}</p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="todo-checkbox"
      />
      <p className="todo-text">{text}</p>
    </div>
  );
};

const Attachment = ({ index, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="attachment-item"
    >
      <div className="attachment-left">
        <span className="attachment-index">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="attachment-link">{link}</p>
      </div>
      <LuSquareArrowUpRight className="attachment-icon" />
    </a>
  );
};