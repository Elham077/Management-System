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
import "./SignUp.css";

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

  const passwordStrength = (pwd) => {
    if (pwd.length >= 12) return "Strong";
    if (pwd.length >= 8) return "Medium";
    if (pwd.length > 0) return "Weak";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError((prev) => ({ ...prev, server: "" }));

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
      <div className="signup-wrapper">
        <h3 className="signup-title">Create an Account</h3>
        <p className="signup-subtitle">
          Welcome! Enter your details to sign up
        </p>

        <form onSubmit={handleSignUp} className="signup-form">
          <ProfilePhotoSelector
            image={profilePic}
            setImage={(file) => {
              if (file instanceof File) setProfilePic(file);
              else console.warn("Selected file is not valid:", file);
            }}
          />

          <div className="form-grid">
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
              className={`password-strength ${passwordStrength(
                password
              ).toLowerCase()}`}
            >
              Password strength: {passwordStrength(password)}
            </p>
          )}

          {error.server && <p className="server-error">{error.server}</p>}

          <button
            type="submit"
            disabled={
              !fullName ||
              !validateEmail(email) ||
              password.length < 8 ||
              loading
            }
            className="submit-btn"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <Link className="login-link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
