import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

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
        <div
          key={index}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-2"
        >
          <div className="flex-1 flex items-center gap-3">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black break-all">{item}</p>
          </div>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center mt-4 gap-5">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            placeholder="Add Attachment"
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          className="card-btn text-nowrap flex items-center gap-1"
        >
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentInput;
