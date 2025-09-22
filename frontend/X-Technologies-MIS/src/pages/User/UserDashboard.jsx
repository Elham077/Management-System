/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import UserContext from "../../context/userContextObject";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
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

const COLORS = ["#f87171", "#60a5fa", "#22c55e"]; // هماهنگ با کارت‌ها

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true); // وضعیت لودینگ
  const [error, setError] = useState(null); // وضعیت خطا
  //? Prepare Chart Data
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
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      setError("Failed to fetch dashboard data.", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="card my-5 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  // حالت خطا
  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="text-center text-red-600 mt-10">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Hi, {user?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-500 mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        {/* کارت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
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
      </div>

      {/* چارت‌ها و جدول */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Distribution</h5>
          </div>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Priority Levels</h5>
          </div>
          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Tasks</h5>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
