import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import "./AddAttachmentInput.css";

const AddAttachmentInput = ({ attachment, setAttachment }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachment([...attachment, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachment.filter((_, idx) => idx !== index);
    setAttachment(updatedArr);
  };

  return (
    <div>
      {attachment.map((item, index) => (
        <div key={index} className="attachment-item">
          <div className="attachment-left">
            <LuPaperclip className="attachment-icon" />
            <p className="attachment-text">{item}</p>
          </div>
          <button
            type="button"
            className="delete-btn"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="delete-icon" />
          </button>
        </div>
      ))}

      <div className="input-row">
        <div className="input-wrapper">
          <LuPaperclip className="attachment-icon" />
          <input
            type="text"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            placeholder="Add Attachment"
            className="input-field"
          />
        </div>
        <button type="button" onClick={handleAddOption} className="add-btn">
          <HiMiniPlus className="add-icon" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentInput;