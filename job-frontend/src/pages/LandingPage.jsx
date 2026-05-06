import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/student/login");
  };

  const features = [
    {
      icon: FiTarget,
      title: "Smart Matching",
      description:
        "Personalized job recommendations based on your profile and skills",
    },
    {
      icon: FiTrendingUp,
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and get personalized learning paths",
    },
    {
      icon: FiAward,
      title: "Top Opportunities",
      description: "Access curated internships and jobs from leading companies",
    },
    {
      icon: FiUsers,
      title: "Easy Application",
      description: "Apply to multiple positions with a single click",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center animate-slide-up">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform">
                <FiBriefcase className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
              JobConnect
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Internship & Job Recommendation System
            </p>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Discover your perfect career opportunity with skill-based job
              matching. Connect your skills with top companies and land your
              dream role.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleLogin}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FiUsers className="w-5 h-5" />
                Student Login
                <FiZap className="w-5 h-5 group-hover:animate-pulse" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose JobConnect?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your career success starts here
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiBriefcase className="w-6 h-6" />
            <span className="text-xl font-bold">JobConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting talent with opportunity
          </p>
          <p className="text-sm text-gray-500">
            © 2026 JobConnect - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
