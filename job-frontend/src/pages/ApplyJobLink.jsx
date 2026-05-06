import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ApplyJobLink = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const { jobs, applications, applyToJob, userRole } = useApp();
  const jobIdValue = String(jobId);

  const job = useMemo(() => {
    return jobs.find((j) => String(j.id) === jobIdValue);
  }, [jobs, jobIdValue]);

  const isApplied = applications.some((app) => String(app.jobId) === jobIdValue);

  const handleApply = async () => {
    // Extra safety: only students should be applying.
    if (userRole !== 'student') return;
    if (job.applicationLink) {
      window.open(job.applicationLink, '_blank', 'noopener,noreferrer');
    }

    const completed = window.confirm(
      'After finishing the application on the opened website, click OK to save it in My Applications.'
    );
    if (!completed) return;

    const ok = await applyToJob(job);
    if (ok) navigate('/student/applications');
  };

  if (!job) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <FiBriefcase className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Job not found</h1>
          </div>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          This application link may be invalid.
        </div>
        <button
          onClick={() => navigate('/student/jobs')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
        <p className="text-blue-100 text-lg">{job.company}</p>
        <p className="text-blue-100 mt-2">
          {job.location} • {job.type}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Job Details</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Duration:</span> {job.duration}
          </div>
          <div>
            <span className="font-semibold">Stipend/Salary:</span> {job.stipend}
          </div>
          <div>
            <span className="font-semibold">Deadline:</span>{' '}
            {new Date(job.deadline).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Skills:</span> {job.skills?.join(', ')}
          </div>
        </div>

        <div className="mt-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold mb-2">Description</p>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>

        <div className="mt-6">
          {isApplied ? (
            <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              You already applied to this job.
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={userRole !== 'student'}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                userRole === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Apply Now
            </button>
          )}
        </div>

        {userRole !== 'student' && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Please login as a student to apply.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplyJobLink;

