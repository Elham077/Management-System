import React, { useRef, useState, useEffect } from "react";
import { LuUpload, LuTrash } from "react-icons/lu";
import defaultProfile from "../../assets/default_Victor.jpeg";
import "./ProfilePhotoSelector.css";

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
    <div className="profile-selector-wrapper">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="profile-input"
      />

      <div className="profile-container">
        <img
          src={preview ? preview : defaultProfile}
          alt="Profile"
          className="profile-image"
          onClick={onChooseFile}
        />

        {!image && (
          <button
            type="button"
            onClick={onChooseFile}
            className="upload-btn"
            title="Upload photo"
          >
            <LuUpload size={18} />
          </button>
        )}

        {image && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="remove-btn"
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
