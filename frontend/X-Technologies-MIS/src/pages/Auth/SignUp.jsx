import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/inputs/input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import UserContext from "../../context/userContextObject";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    server: "",
  });
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Password strength helper
  const passwordStrength = (pwd) => {
    if (pwd.length >= 12) return "Strong";
    if (pwd.length >= 8) return "Medium";
    if (pwd.length > 0) return "Weak";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // reset server error
    setError((prev) => ({ ...prev, server: "" }));

    // Basic validation
    if (!fullName) {
      setError((prev) => ({ ...prev, fullName: "Full name is required" }));
      return;
    }
    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email address" }));
      return;
    }
    if (password.length < 8) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return;
    }

    setLoading(true);
    let profileImageUrl = "";

    try {
      // Upload profile picture if exists
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageURL || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      console.error("SIGNUP ERROR:", err.response || err);
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
      <div className="lg:w-[80%] md:w-[95%] w-full h-auto mt-10 md:mt-0 flex flex-col justify-center mx-auto px-6 md:px-12 py-8 bg-white shadow-xl rounded-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Create an Account
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Welcome! Enter your details to sign up
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          {/* Profile photo selector */}
          <ProfilePhotoSelector
            image={profilePic}
            setImage={(file) => {
              if (file instanceof File) setProfilePic(file);
              else console.warn("Selected file is not valid:", file);
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              value={fullName}
              onChange={(value) => {
                setFullName(value);
                setError((prev) => ({ ...prev, fullName: "" }));
              }}
              label="Full Name"
              type="text"
              error={error.fullName}
            />

            <Input
              value={email}
              onChange={(value) => {
                setEmail(value);
                setError((prev) => ({ ...prev, email: "" }));
              }}
              label="Email Address"
              type="text"
              error={error.email}
            />

            <Input
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError((prev) => ({ ...prev, password: "" }));
              }}
              label="Password"
              type="password"
              error={error.password}
            />

            <Input
              value={adminInviteToken}
              onChange={(value) => setAdminInviteToken(value)}
              label="Admin Invite Token (Optional)"
              type="text"
            />
          </div>

          {password && (
            <p
              className={`text-sm ${
                passwordStrength(password) === "Strong"
                  ? "text-green-600"
                  : passwordStrength(password) === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              Password strength: {passwordStrength(password)}
            </p>
          )}

          {error.server && (
            <p className="text-red-500 text-sm mt-1">{error.server}</p>
          )}

          <button
            type="submit"
            disabled={
              !fullName ||
              !validateEmail(email) ||
              password.length < 8 ||
              loading
            }
            className={`w-full mt-4 rounded-md p-3 text-sm font-semibold text-white shadow transition duration-200
              ${
                !fullName ||
                !validateEmail(email) ||
                password.length < 8 ||
                loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              className="text-orange-500 font-medium hover:underline"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
