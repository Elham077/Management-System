import React, { useContext } from "react";
import UserContext from "../../context/userContextObject";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

export const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="dashboard-layout">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};
export default DashboardLayout;
