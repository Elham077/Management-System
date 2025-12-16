/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuPlus } from "react-icons/lu";
import ExpenseStatusTabs from "../../components/ExpenseStatusTabs";
import ExpenseCard from "../../components/Cards/ExpenseCard";

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

      // فراخوانی API (backend خودش محدود به createdBy=user یا admin است)
      const response = await axiosInstance.get(API_PATHS.Expenses.GET_ALL_EXPENSES);
      const expenses = response.data || [];

      // فیلتر وضعیت‌ها
      const filteredExpenses =
        filterStatus === "All"
          ? expenses
          : expenses.filter((e) => e.status === filterStatus);

      setAllExpenses(filteredExpenses);

      // ساخت summary وضعیت‌ها
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
      <div className="my-5">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h2 className="text-xl md:text-xl font-semibold mb-4">My Expenses</h2>

          {/* دکمه ایجاد صرفاً کاربر خودش */}
          <button
            className="flex items-center gap-1 create-btn"
            onClick={() => navigate("/user/add-expense")}
          >
            <LuPlus className="text-lg" /> Add Expense
          </button>
        </div>

        {/* Status Tabs */}
        {tabs?.[0]?.count > 0 && (
          <div className="flex items-center gap-3 mt-4">
            <ExpenseStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

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

export default MyExpenses;
