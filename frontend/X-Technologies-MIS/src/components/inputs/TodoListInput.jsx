import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import "./TodoListInput.css";

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
    <div className="todo-list-container">
      {todoList.map((item, index) => (
        <div key={item + index} className="todo-item">
          <p className="todo-text">
            <span className="todo-index">
              {index < 9 ? `0${index + 1}` : index + 1}.
            </span>
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className="delete-btn"
          >
            <HiOutlineTrash className="delete-icon" />
          </button>
        </div>
      ))}

      <div className="input-row">
        <input
          type="text"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          placeholder="Enter Task"
          className="todo-input"
        />
        <button onClick={handleAddOption} className="add-btn">
          <HiMiniPlus className="add-icon" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
