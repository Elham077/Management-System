import axiosInstance from "../../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { toast } from "react-toastify";

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ برای حالت لودینگ
  const [error, setError] = useState(null); // ✅ برای هندلینگ خطا

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

  // Handle Download Reports
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS_REPORT,
        {
          responseType: "blob",
        }
      );
      // create url for blob
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
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Manage User</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        {/* نمایش وضعیت لودینگ یا خطا */}
        {loading && <p className="mt-4">Loading users...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* لیست یوزرها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user?._id} userInfo={user} />
          ))}
        </div>

        {/* وقتی دیتایی نیست */}
        {!loading && !error && allUsers.length === 0 && (
          <p className="mt-4 text-gray-500">No users found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
