import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";
import ExpenseStatusTabs from "../../components/ExpenseStatusTabs";
import ExpenseCard from "../../components/Cards/ExpenseCard";
import "./ManageExpenses.css";

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

      const filteredExpenses =
        filterStatus === "All"
          ? expenses
          : expenses.filter((e) => e.status === filterStatus);

      setAllExpenses(filteredExpenses);

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

      const contentType = response.data.type;

      if (contentType === "application/json") {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        console.error("Server error:", errorData);
        alert(errorData.message || "Failed to generate report");
        return;
      }

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
      <div className="manage-expenses-wrapper">
        <div className="page-header">
          <div className="header-actions">
            <h2 className="page-title">Manage Expenses</h2>
            <button
              className="download-btn lg:hidden"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" /> Download Report
            </button>
            <button
              className="create-btn lg:hidden"
              onClick={() => navigate("/admin/add-expense")}
            >
              <LuPlus className="text-lg" /> Add Expense
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="tabs-wrapper">
              <ExpenseStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="download-btn hidden lg:flex"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" /> Download Report
              </button>
              <button
                className="create-btn hidden lg:flex"
                onClick={() => navigate("/admin/add-expense")}
              >
                <LuPlus className="text-lg" /> Add Expense
              </button>
            </div>
          )}
        </div>

        {loading && <p className="loading-text">Loading expenses...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="expenses-grid">
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
              <p className="empty-state">No expenses found.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageExpenses;
