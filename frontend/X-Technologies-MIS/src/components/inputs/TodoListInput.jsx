import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };
  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={item + index}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}.
            </span>
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}
      <div className="flex items-center mt-4 gap-5">
        <input
          type="text"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          placeholder="Enter Task"
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-2 rounded-md py-2"
        />
        <button onClick={handleAddOption} className="card-btn text-nowrap">
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;