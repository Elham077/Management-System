import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import UserContext from "../../context/userContextObject";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {updateUser} = useContext(UserContext);
  // Validation live
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
    if(!validateEmail(email)){
      setError("Please Enter a valid email address")
      return;
    }
    if(!password){
      setError("Please Enter your password")
      return;
    }
    setError("");

    //? Login Api call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const {token, role}= response.data;
      if(token){
        // Save token to local storage
        localStorage.setItem("token", token);
        // Update user context
        updateUser(response.data);
        //? Redirect based on role
        if(role === "admin"){
          navigate("/admin/dashboard");
        }else {
          navigate("/user/dashboard")
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
      <div className="lg:w-[70%] md:w-[90%] w-full h-full flex flex-col justify-center mx-auto px-6 md:px-12 py-8 bg-white shadow-xl rounded-xl transition-all duration-500 ease-in-out">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please enter your details to log in
        </p>

        <form className="flex flex-col gap-4">
          <Input
            value={email}
            onChange={handleEmailChange}
            label="Email Address"
            type="text"
            // placeholder="elham@example.com"
            error={error.email}
          />

          <Input
            value={password}
            onChange={handlePasswordChange}
            label="Password"
            type="password"
            // placeholder="Minimum 8 characters"
            error={error.password}
          />

          {error.server && (
            <p className="text-red-500 text-sm mt-1">{error.server}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !email || !password || error.email || error.password || loading
            }
            className={`w-full mt-4 rounded-md p-3 text-sm font-semibold text-white shadow transition duration-200
              ${
                !email || !password || error.email || error.password || loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account?{" "}
            <Link
              className="text-orange-500 font-medium hover:underline"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
