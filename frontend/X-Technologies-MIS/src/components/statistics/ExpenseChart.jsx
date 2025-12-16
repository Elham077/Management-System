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
import "./ExpenseChart.css";

const ExpenseChart = ({ monthlyExpenses = [] }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

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

  const formattedMonthly = monthlyExpenses.map((m) => ({
    month: monthNames[m.month] || m.month,
    amount: m.amount,
  }));

  const monthlyTotal = monthlyExpenses.reduce((sum, i) => sum + i.amount, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-box">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {`${payload[0].name}: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="expense-chart-wrapper">
      <div className="chart-header">
        <h2 className="chart-title">Monthly Expense Overview</h2>
      </div>

      <div className="summary-box">
        <h3 className="summary-label">Total Monthly Expenses</h3>
        <p className="summary-amount">{formatCurrency(monthlyTotal)}</p>
        <p className="summary-note">{monthlyExpenses.length} months</p>
      </div>

      <div className="chart-body">
        <div className="chart-subheader">
          <h3 className="chart-subtitle">Monthly Expenses</h3>
          <span className="avg-text">
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
