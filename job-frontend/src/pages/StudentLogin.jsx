import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiGitBranch,
  FiLock,
  FiLogIn,
  FiMail,
  FiUser,
  FiUserPlus,
  FiAward,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { GoogleLogin } from "@react-oauth/google";
import { API_URL } from "../utils/jobsApi";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { setStudent, setUserRole, userRole } = useApp();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    college: "",
    graduationYear: "",
    degree: "",
    branch: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = () => ({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    college: "",
    graduationYear: "",
    degree: "",
    branch: "",
  });

  const resetToLogin = (nextMessage = "") => {
    setMode("login");
    setForm(emptyForm());
    setError("");
    setMessage(nextMessage);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setForm(emptyForm());
  };

  const loginStudent = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    setStudent(data.user);
    setForm(emptyForm());
    setUserRole("student");
    navigate("/student/dashboard");
  };

  const signupStudent = async () => {
    // Basic regex check before submitting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      throw new Error("Please enter a valid email format.");
    }

    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
        graduationYear: Number(form.graduationYear),
        degree: form.degree,
        branch: form.branch,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    resetToLogin("Signup successful. You can login now.");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      setStudent(data.user);
      setForm(emptyForm());
      setUserRole("student");
      
      // Redirect to profile if they are missing critical education details
      if (!data.user.degree || !data.user.college) {
        navigate("/student/profile");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.message || "Google Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Password reset failed");
    }

    resetToLogin("Password updated. Login with your new password.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginStudent();
      } else if (mode === "signup") {
        await signupStudent();
      } else {
        await resetPassword();
      }
    } catch (err) {
      setError(err.message || "Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "student") {
      navigate("/student/dashboard");
      return;
    }

    setMode("login");
    setError("");
    setMessage("");
    setForm(emptyForm());
  }, [userRole, navigate]);

  const title =
    mode === "signup"
      ? "Student Signup"
      : mode === "forgot"
        ? "Forgot Password"
        : "Student Login";

  const buttonText =
    mode === "signup"
      ? "Create Account"
      : mode === "forgot"
        ? "Update Password"
        : "Login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-8 border border-white/70 backdrop-blur-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        <form
          key={mode}
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="new-password"
        >
          {mode === "signup" && (
            <InputField
              icon={<FiUser />}
              label="Name"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
              placeholder="Enter name"
              required
            />
          )}

          <InputField
            icon={<FiMail />}
            label="Email"
            type="email"
            name={`${mode}-student-email-${Date.now()}`}
            value={form.email}
            onChange={(value) => updateForm("email", value)}
            placeholder="Enter email"
            required
          />

          {mode !== "forgot" && (
            <div>
              <InputField
                icon={<FiLock />}
                label="Password"
                type="password"
                name={`${mode}-student-password-${Date.now()}`}
                value={form.password}
                onChange={(value) => updateForm("password", value)}
                placeholder="Enter password"
                required
              />
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {mode === "forgot" && (
            <InputField
              icon={<FiLock />}
              label="New Password"
              type="password"
              name={`student-new-password-${Date.now()}`}
              value={form.newPassword}
              onChange={(value) => updateForm("newPassword", value)}
              placeholder="Enter new password"
              required
            />
          )}

          {mode === "signup" && (
            <>
              <InputField
                icon={<FiAward />}
                label="College / University"
                value={form.college}
                onChange={(value) => updateForm("college", value)}
                placeholder="Enter college name"
                required
              />
              <InputField
                icon={<FiAward />}
                label="Graduation Year"
                type="number"
                value={form.graduationYear}
                onChange={(value) => updateForm("graduationYear", value)}
                placeholder="Enter graduation year (e.g. 2026)"
                required
              />
              <InputField
                icon={<FiBookOpen />}
                label="Degree"
                value={form.degree}
                onChange={(value) => updateForm("degree", value)}
                placeholder="Enter degree"
                required
              />
              <InputField
                icon={<FiGitBranch />}
                label="Branch"
                value={form.branch}
                onChange={(value) => updateForm("branch", value)}
                placeholder="Enter branch"
                required
              />
            </>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-green-600 dark:text-green-400">
              {message}
            </div>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to login
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {mode === "signup" ? (
              <FiUserPlus className="w-5 h-5" />
            ) : (
              <FiLogIn className="w-5 h-5" />
            )}
            {loading ? "Please wait..." : buttonText}
          </button>

          {mode === "login" && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center w-full mb-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-3 text-sm text-gray-500">or continue with</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                useOneTap
              />
            </div>
          )}

          {mode === "login" && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Login
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const [editable, setEditable] = useState(false);
  const [safeName] = useState(
    () => `${name || label.toLowerCase().replaceAll(" ", "-")}-${Math.random()}`
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          name={safeName}
          autoComplete="new-password"
          readOnly={!editable}
          onFocus={() => setEditable(true)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          required={required}
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default StudentLogin;
