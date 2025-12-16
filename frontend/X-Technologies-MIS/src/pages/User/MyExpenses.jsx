/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuPlus } from "react-icons/lu";
import ExpenseStatusTabs from "../../components/ExpenseStatusTabs";
import ExpenseCard from "../../components/Cards/ExpenseCard";
import "./MyExpenses.css";

const EXPENSE_STATUSES = ["All", "Pending", "Approved", "Rejected"];

const MyExpenses = () => {
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
    navigate("/user/add-expense", { state: { expenseId: expense?._id } });
  };

  useEffect(() => {
    getAllExpenses();
  }, []);

  useEffect(() => {
    setAllExpenses((prev) => {
      const filtered =
        filterStatus === "All"
          ? prev
          : prev.filter((e) => e.status === filterStatus);
      return filtered;
    });
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Expenses">
      <div className="my-expenses-wrapper">
        <div className="page-header">
          <h2 className="page-title">My Expenses</h2>
          <button
            className="create-btn"
            onClick={() => navigate("/user/add-expense")}
          >
            <LuPlus className="text-lg" /> Add Expense
          </button>
        </div>

        {tabs?.[0]?.count > 0 && (
          <div className="tabs-container">
            <ExpenseStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

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

export default MyExpenses;
