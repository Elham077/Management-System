/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";
import ExpenseStatusTabs from "../../components/ExpenseStatusTabs";
import ExpenseCard from "../../components/Cards/ExpenseCard";

const EXPENSE_STATUSES = ["All", "Pending", "Approved", "Rejected"];

const ManageExpenses = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getAllExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        API_PATHS.Expenses.GET_ALL_EXPENSES
      );
      const expenses = response.data || [];

      // فیلتر کردن آرایه بر اساس وضعیت انتخاب شده
      const filteredExpenses =
        filterStatus === "All"
          ? expenses
          : expenses.filter((e) => e.status === filterStatus);

      setAllExpenses(filteredExpenses);

      // ساخت summary وضعیت‌ها از روی آرایه
      const statusCounts = {
        Pending: expenses.filter((e) => e.status === "Pending").length,
        Approved: expenses.filter((e) => e.status === "Approved").length,
        Rejected: expenses.filter((e) => e.status === "Rejected").length,
        all: expenses.length,
      };

      const statusArray = [
        { label: "All", count: statusCounts.all },
        { label: "Pending", count: statusCounts.Pending },
        { label: "Approved", count: statusCounts.Approved },
        { label: "Rejected", count: statusCounts.Rejected },
      ];
      setTabs(statusArray);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (expense) => {
    navigate("/admin/add-expense", { state: { expenseId: expense._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_EXPENSES_REPORT,
        {
          responseType: "blob",
        }
      );

      // بررسی نوع محتوا
      const contentType = response.data.type;

      if (contentType === "application/json") {
        // اگر به جای فایل، JSON خطا آمد
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        console.error("Server error:", errorData);
        alert(errorData.message || "Failed to generate report");
        return;
      }

      // اگر واقعاً فایل Excel بود
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Error downloading report");
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Expenses">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          {/* عنوان و دکمه‌های موبایل */}
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <h2 className="text-xl md:text-xl font-semibold">
              Manage Expenses
            </h2>
            {/* دکمه موبایل دانلود */}
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" /> Download Report
            </button>
            {/* دکمه موبایل ایجاد */}
            <button
              className="flex lg:hidden create-btn ml-2"
              onClick={() => navigate("/admin/add-expense")}
            >
              <LuPlus className="text-lg" /> Add Expense
            </button>
          </div>

          {/* تب‌ها و دکمه‌های دسکتاپ */}
          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <ExpenseStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              {/* دسکتاپ دانلود */}
              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" /> Download Report
              </button>
              {/* دسکتاپ ایجاد */}
              <button
                className="hidden lg:flex create-btn"
                onClick={() => navigate("/admin/add-expense")}
              >
                <LuPlus className="text-lg" /> Add Expense
              </button>
            </div>
          )}
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-500 mt-4">Loading expenses...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Expenses Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allExpenses.length > 0 ? (
              allExpenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  title={expense.title}
                  amount={expense.amount}
                  category={expense.category}
                  status={expense.status}
                  expenseDate={expense.expenseDate}
                  createdBy={expense.createdBy}
                  attachmentCount={expense.attachment?.length || 0}
                  onClick={() => handleClick(expense)}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No expenses found.
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageExpenses;
