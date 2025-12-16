import axiosInstance from "../../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { toast } from "react-toastify";
import "./ManageUser.css";

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      console.log("Users array:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setAllUsers(response.data);
      } else {
        console.warn("No users found.");
        setAllUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users: ", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS_REPORT,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading user details:", error);
      toast.error("Failed to download user details. please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="manage-user-wrapper">
        <div className="page-header">
          <h2 className="page-title">Manage User</h2>
          <button className="download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        {loading && <p className="loading-text">Loading users...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="users-grid">
          {allUsers?.map((user) => (
            <UserCard key={user?._id} userInfo={user} />
          ))}
        </div>

        {!loading && !error && allUsers.length === 0 && (
          <p className="empty-state">No users found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
