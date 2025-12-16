import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import UserContext from "../../context/userContextObject";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleEmailChange = (value) => {
    setEmail(value);
    setError((prev) => ({
      ...prev,
      email: validateEmail(value) ? "" : "Invalid email address",
      server: "",
    }));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setError((prev) => ({
      ...prev,
      password:
        value.length >= 6 ? "" : "Password must be at least 8 characters",
      server: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please Enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please Enter your password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError((prev) => ({
        ...prev,
        server:
          err.response?.data?.message || "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-wrapper">
        <h3 className="login-title">Welcome Back</h3>
        <p className="login-subtitle">Please enter your details to log in</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={handleEmailChange}
            label="Email Address"
            type="text"
            error={error.email}
          />

          <Input
            value={password}
            onChange={handlePasswordChange}
            label="Password"
            type="password"
            error={error.password}
          />

          {error.server && <p className="server-error">{error.server}</p>}

          <button
            type="submit"
            disabled={
              !email || !password || error.email || error.password || loading
            }
            className="submit-btn"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link className="signup-link" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
