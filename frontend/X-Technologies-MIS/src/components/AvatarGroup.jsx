import React from "react";

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className="flex items-center ml-2 rounded-2xl">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className={`w-8 h-8 rounded-full border-2 border-white object-cover ${
            index !== 0 ? "-ml-2" : ""
          }`}
        />
      ))}

      {avatars.length > maxVisible && (
        <div className="-ml-2 w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
