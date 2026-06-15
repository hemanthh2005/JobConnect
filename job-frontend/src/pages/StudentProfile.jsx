import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiEdit2,
  FiGitBranch,
  FiMail,
  FiAward,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/jobsApi";

const StudentProfile = () => {
  const { student, setStudent } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    graduationYear: "",
    degree: "",
    branch: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      college: student.college || "",
      graduationYear: student.graduationYear || "",
      degree: student.degree || "",
      branch: student.branch || "",
    });
  }, [student]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      college: student.college || "",
      graduationYear: student.graduationYear || "",
      degree: student.degree || "",
      branch: student.branch || "",
    });
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const lookupEmail = student.email || form.email;
      const res = await fetch(`${API_URL}/profile/${lookupEmail}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setStudent(data);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and update the details used for your student account.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <ProfileField
              icon={<FiUser />}
              label="Name"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
              disabled={!editing}
            />
            <ProfileField
              icon={<FiMail />}
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateForm("email", value)}
              disabled={!editing}
            />
            <ProfileField
              icon={<FiAward />}
              label="College / University"
              value={form.college}
              onChange={(value) => updateForm("college", value)}
              disabled={!editing}
            />
            <ProfileField
              icon={<FiAward />}
              label="Graduation Year"
              type="number"
              value={form.graduationYear}
              onChange={(value) => updateForm("graduationYear", value)}
              disabled={!editing}
            />
            <ProfileField
              icon={<FiBookOpen />}
              label="Degree"
              value={form.degree}
              onChange={(value) => updateForm("degree", value)}
              disabled={!editing}
            />
            <ProfileField
              icon={<FiGitBranch />}
              label="Branch"
              value={form.branch}
              onChange={(value) => updateForm("branch", value)}
              disabled={!editing}
            />
          </div>

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

          {editing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
              >
                <FiSave className="w-4 h-4" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const ProfileField = ({
  icon,
  label,
  type = "text",
  value,
  onChange,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-300"
      />
    </div>
  </div>
);

export default StudentProfile;
