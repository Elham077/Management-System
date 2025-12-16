/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import moment from "moment";
import { LuSquareArrowUpRight } from "react-icons/lu";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
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
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="col-span-6 md:col-end-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
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
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
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
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
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
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-400 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />
      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ index, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xs text-gray-400 font-semibold">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-blue-600 underline truncate">{link}</p>
      </div>
      <LuSquareArrowUpRight className="text-gray-500" />
    </a>
  );
};
