import React, { useContext } from "react";
import UserContext from "../../context/userContextObject";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import "./DashboardLayout.css";

export const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="dashboard-layout">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="dashboard-body">
          <div className="side-menu-wrapper">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="content-wrapper">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;