import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const ExpenseChart = ({ monthlyExpenses = [] }) => {
  // فرمت مالی
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // نام ماه‌ها
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // آماده‌سازی داده‌ها
  const formattedMonthly = monthlyExpenses.map((m) => ({
    month: monthNames[m.month] || m.month,
    amount: m.amount,
  }));

  // مجموع ماهانه
  const monthlyTotal = monthlyExpenses.reduce((sum, i) => sum + i.amount, 0);

  // Tooltip سفارشی
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-green-600">
            {`${payload[0].name}: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Monthly Expense Overview
        </h2>
      </div>

      {/* خلاصه آماری */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
        <h3 className="text-sm font-medium text-green-800">
          Total Monthly Expenses
        </h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(monthlyTotal)}
        </p>
        <p className="text-xs text-green-600 mt-1">
          {monthlyExpenses.length} months
        </p>
      </div>

      {/* نمودار */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Monthly Expenses
          </h3>
          <span className="text-sm text-gray-500">
            Avg:{" "}
            {monthlyExpenses.length
              ? formatCurrency(monthlyTotal / monthlyExpenses.length)
              : "-"}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedMonthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#4b5563", fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinecap="round"
              name="Monthly Expense"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#059669" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
