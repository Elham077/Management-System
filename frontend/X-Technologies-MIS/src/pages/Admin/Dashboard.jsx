import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import UserContext from "../../context/userContextObject";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { addThousandSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/statistics/CustomPieChart";
import CustomBarChart from "../../components/statistics/CustomBarChart";
import ExpenseChart from "../../components/statistics/ExpenseChart";
import "./Dashboard.css";

const COLORS = ["#f87171", "#60a5fa", "#22c55e"];

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  const prepareChartData = (data) => {
    const taskdistribution = data?.taskDistribution || 0;
    const taskPriorityLevel = data?.taskPriorityLevel || 0;

    const taskDistributionData = [
      { status: "Pending", count: taskdistribution?.Pending || 0 },
      { status: "In Progress", count: taskdistribution?.InProgress || 0 },
      { status: "Completed", count: taskdistribution?.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevel?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevel?.Medium || 0 },
      { priority: "High", count: taskPriorityLevel?.High || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBORAD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.Expenses.GET_EXPENSES_DASHBORAD_DATA
        );

        const { categories, recentExpenses } = res.data;

        const weekly = recentExpenses.map((item, index) => ({
          week: `Week ${index + 1}`,
          amount: item.amount,
        }));

        const monthly = categories.map((cat) => ({
          month: cat._id,
          amount: cat.totalAmount,
        }));

        setWeeklyExpenses(weekly);
        setMonthlyExpenses(monthly);
      } catch (error) {
        console.error("Error fetching expense chart data:", error);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="dashboard-wrapper">
          <div className="welcome-card skeleton">
            <div className="skeleton-bar w-1/4"></div>
            <div className="skeleton-bar w-1/3"></div>
          </div>
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
          <div className="chart-grid">
            <div className="skeleton-chart"></div>
            <div className="skeleton-chart"></div>
            <div className="skeleton-chart full-width-chart"></div>
            <div className="skeleton-chart full-width-chart"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="error-message">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="dashboard-wrapper">
        <div className="welcome-card">
          <h2 className="welcome-title">Hi, {user?.name}</h2>
          <p className="welcome-date">{moment().format("dddd Do MMM YYYY")}</p>
        </div>

        <div className="stats-grid">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-indigo-600"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-red-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-blue-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-green-500"
          />
        </div>

        <div className="chart-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h5 className="chart-title">Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h5 className="chart-title">Task Priority Levels</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>

          <div className="full-width-chart">
            <div className="chart-header">
              <h5 className="chart-title">Expenses</h5>
            </div>
            <ExpenseChart
              weeklyExpenses={weeklyExpenses}
              monthlyExpenses={monthlyExpenses}
            />
          </div>

          <div className="chart-card full-width-chart">
            <div className="chart-header">
              <h5 className="chart-title">Recent Tasks</h5>
              <button className="see-all-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
