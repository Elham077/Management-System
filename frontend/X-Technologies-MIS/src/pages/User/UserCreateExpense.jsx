import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import moment from "moment";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import AddAttachmentInput from "../../components/inputs/AddAttachmentInput";
import { EXPENSE_CATEGORY_DATA } from "../../utils/data";

const UserCreateExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const expenseId = location.state?.expenseId || null;

  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "Office",
    expenseDate: moment().format("YYYY-MM-DD"),
    description: "",
    status: "Pending",
    attachment: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValueChange = (key, value) => {
    setExpenseData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setExpenseData({
      title: "",
      amount: "",
      category: "Office",
      expenseDate: moment().format("YYYY-MM-DD"),
      description: "",
      status: "Pending",
      attachment: [],
    });
  };

  useEffect(() => {
    if (!expenseId) return;

    const fetchExpense = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          API_PATHS.Expenses.GET_EXPENSE_BY_ID(expenseId)
        );
        const data = res.data || {};
        setExpenseData({
          title: data.title || "",
          amount: data.amount || "",
          category: data.category || "Office",
          expenseDate: data.expenseDate
            ? moment(data.expenseDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
          description: data.description || "",
          status: data.status || "Pending",
          attachment: data.attachment || [],
        });
      } catch (err) {
        console.error("Error fetching expense:", err);
        toast.error("Failed to fetch expense data");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const createExpense = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.Expenses.CREATE_EXPENSE, {
        ...expenseData,
        amount: Number(expenseData.amount),
        expenseDate: new Date(expenseData.expenseDate).toISOString(),
      });
      toast.success("Expense created successfully");
      clearData();
      navigate("/user/expenses");
    } catch (err) {
      console.error("Error creating expense:", err);
      toast.error("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.Expenses.UPDATE_EXPENSE(expenseId), {
        ...expenseData,
        amount: Number(expenseData.amount),
        expenseDate: new Date(expenseData.expenseDate).toISOString(),
      });
      toast.success("Expense updated successfully");
      navigate("/user/expenses");
    } catch (err) {
      console.error("Error updating expense:", err);
      toast.error("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setError("");
    if (!expenseData.title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }
    if (!expenseData.amount || Number(expenseData.amount) <= 0) {
      setError("Amount must be greater than 0");
      toast.error("Amount must be greater than 0");
      return;
    }
    if (!expenseData.expenseDate) {
      setError("Expense Date is required");
      toast.error("Expense Date is required");
      return;
    }

    expenseId ? updateExpense() : createExpense();
  };

  if (loading) {
    return (
      <DashboardLayout
        activeMenu={expenseId ? "Update Expense" : "Add Expense"}
      >
        <p className="text-center mt-10">Loading expense data...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu={expenseId ? "Update Expense" : "Add Expense"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <h2 className="text-xl md:text-xl font-medium mb-4">
              {expenseId ? "Update Expense" : "Add New Expense"}
            </h2>

            {/* Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Title
              </label>
              <input
                type="text"
                placeholder="Expense title"
                className="form-input"
                value={expenseData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Amount
              </label>
              <input
                type="number"
                placeholder="1000"
                className="form-input"
                value={expenseData.amount}
                onChange={(e) => handleValueChange("amount", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Category
              </label>
              <SelectDropDown
                options={EXPENSE_CATEGORY_DATA}
                value={expenseData.category || "Office"}
                onChange={(val) => handleValueChange("category", val)}
                placeholder="Select Category"
              />
            </div>

            {/* Expense Date */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Expense Date
              </label>
              <input
                type="date"
                className="form-input"
                value={expenseData.expenseDate}
                onChange={(e) =>
                  handleValueChange("expenseDate", e.target.value)
                }
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={expenseData.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Attachments
              </label>
              <AddAttachmentInput
                attachment={expenseData.attachment || []}
                setAttachment={(val) => handleValueChange("attachment", val)}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-rose-500 text-xs mt-2 font-medium">{error}</p>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {expenseId ? "UPDATE EXPENSE" : "CREATE EXPENSE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserCreateExpense;
