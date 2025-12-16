import React, { useRef, useState, useEffect } from "react";
import { LuUpload, LuTrash } from "react-icons/lu";
import defaultProfile from "../../assets/default_Victor.jpeg";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const onChooseFile = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 group">
        {/* تصویر */}
        <img
          src={preview ? preview : defaultProfile}
          alt="Profile"
          className="w-full h-full rounded-full object-cover cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105 shadow-md"
          onClick={onChooseFile}
        />

        {!image && (
          <button
            type="button"
            onClick={onChooseFile}
            className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-orange-400 text-white rounded-full shadow hover:bg-orange-500 transition-all duration-200"
            title="Upload photo"
          >
            <LuUpload size={18} />
          </button>
        )}

        {image && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-all duration-200"
            title="Remove photo"
          >
            <LuTrash size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
