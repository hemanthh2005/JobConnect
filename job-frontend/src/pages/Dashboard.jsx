import { useState, useEffect } from 'react';
import { FiTrendingUp, FiBriefcase, FiCheckCircle, FiClock, FiPlusCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillTag from '../components/SkillTag';

const Dashboard = () => {
  const { student, getRecommendedJobs, applyToJob, applications, jobs, updateStudentSkills, fetchLiveJobs, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const data = await fetchLiveJobs({
          location: 'India',
          results: 12,
        });

        if (!ignore) {
          setRecommendedJobs(
            data.jobs
              .map((job) => ({
                ...job,
                matchPercentage: getRecommendedJobs()
                  .find((recommendedJob) => recommendedJob.id === job.id)
                  ?.matchPercentage,
              }))
              .slice(0, 6)
          );
        }
      } catch (error) {
        if (!ignore) {
          setRecommendedJobs(getRecommendedJobs());
          addNotification(error.message || 'Showing saved jobs because live jobs failed.', 'warning');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadRecommendations();

    return () => {
      ignore = true;
    };
  }, [student.email, student.degree, student.branch, student.skills]);

  useEffect(() => {
    if (!loading) {
      setRecommendedJobs(getRecommendedJobs().slice(0, 6));
    }
  }, [jobs]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const alreadyExists = student.skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setSkillInput('');
      return;
    }

    updateStudentSkills([...student.skills, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    updateStudentSkills(student.skills.filter((s) => s !== skill));
  };

  const stats = [
    {
      icon: FiBriefcase,
      label: 'Jobs Applied',
      value: applications.length,
      color: 'bg-blue-500'
    },
    {
      icon: FiCheckCircle,
      label: 'Profile Complete',
      value: `${student.profileComplete}%`,
      color: 'bg-green-500'
    },
    {
      icon: FiTrendingUp,
      label: 'Skills Added',
      value: student.skills.length,
      color: 'bg-purple-500'
    },
    {
      icon: FiClock,
      label: 'Pending Actions',
      value: student.resumeUploaded ? 0 : 1,
      color: 'bg-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {student.name}!
        </h1>
        <p className="text-blue-100 text-lg">
          {[student.degree, student.branch].filter(Boolean).join(' - ') || 'Student'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* My Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Skills</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add skills to improve matching and recommendations.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            type="text"
            placeholder="e.g., React, SQL, Machine Learning"
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddSkill}
            type="button"
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              skillInput.trim().length === 0
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={skillInput.trim().length === 0}
          >
            <FiPlusCircle className="w-5 h-5" />
            Add
          </button>
        </div>

        {student.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.skills.map((skill) => (
              <SkillTag
                key={skill}
                skill={skill}
                variant="gray"
                onRemove={handleRemoveSkill}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            No skills added yet.
          </div>
        )}
      </div>

      {/* Resume Upload Alert */}
      {!student.resumeUploaded && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg animate-slide-up">
          <div className="flex items-start gap-3">
            <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                Action Required: Upload Your Resume
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                Upload your resume to get better job recommendations and improve your match score.
              </p>
              <button
                onClick={() => window.location.href = '/student/upload-resume'}
                className="text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:underline"
              >
                Upload Resume →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-blue-600 dark:text-blue-400" />
              Top Recommended Jobs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Based on your skills and profile
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showMatch={true}
              onApply={applyToJob}
            />
          ))}
        </div>

        {recommendedJobs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No recommendations yet. Upload your resume to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
