import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import UserContext from "../../context/userContextObject";
import "./SideMenu.css";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="side-menu">
      <div className="profile-section">
        <img
          src={user?.profileImageUrl || ""}
          alt="Profile"
          className="profile-image"
        />
        {user?.role === "admin" && <div className="admin-badge">Admin</div>}
        <h5 className="user-name">{user?.name || "UNKNOWN"}</h5>
        <p className="user-email">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`menu-button ${activeMenu === item.label ? "active" : ""}`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="menu-icon" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
