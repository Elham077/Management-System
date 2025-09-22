import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//* ====================================
//* ||======== Authentication UI======||
//* ====================================
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
//* ====================================
//* ||=========== Admin UI============||
//* ====================================
import Dashboard from "./pages/Admin/Dashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
//* ====================================
//* ||=========== User UI=============||
//* ====================================
import MyTasks from "./pages/User/MyTasks";
import UserDashboard from "./pages/User/UserDashboard";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
//* ====================================
//* ||======== PrivateRoute UI========||
//* ====================================
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider from "./context/userContext";
import { useContext } from "react";
import UserContext from "./context/userContextObject";
import ManageProjects from "./pages/Admin/ManageProjects";
import CreateProject from "./pages/Admin/CreateProjects";
import ManageExpenses from "./pages/Admin/ManageExpenses";
import AddExpense from "./pages/Admin/addExpense";
import MyProjects from "./pages/User/MyProjects";
import MyExpenses from "./pages/User/MyExpenses";
import UserCreateExpense from "./pages/User/UserCreateExpense";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes  */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            {/*  Admin Routes  */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/projects" element={<ManageProjects />} />
              <Route path="/admin/create-project" element={<CreateProject />} />
              <Route path="/admin/expenses" element={<ManageExpenses />} />
              <Route path="/admin/add-expense" element={<AddExpense />} />

            </Route>
            {/*  User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/projects" element={<MyProjects />} />
              <Route path="/user/expenses" element={<MyExpenses />} />
              <Route path="/user/add-expense" element={<UserCreateExpense />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              />
            </Route>
            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </UserProvider>
  );
}
export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/user/dashboard" replace />;
};
