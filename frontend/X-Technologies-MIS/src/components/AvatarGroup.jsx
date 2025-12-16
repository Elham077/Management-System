import React from "react";
import "./AvatarGroup.css";

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className="avatar-group">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className="avatar-img"
        />
      ))}

      {avatars.length > maxVisible && (
        <div className="avatar-more">+{avatars.length - maxVisible}</div>
      )}
    </div>
  );
};

export default AvatarGroup;
