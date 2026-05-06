import { useState } from 'react';
import { FiBookmark, FiCheck, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SkillTag from './SkillTag';
import ProgressBar from './ProgressBar';

const JobCard = ({ job, showMatch = true, onApply }) => {
  const { calculateMatchPercentage, getSkillGap, student, applications, savedJobs, saveJob } = useApp();
  const [expanded, setExpanded] = useState(false);

  const matchPercentage = showMatch ? calculateMatchPercentage(job.skills) : null;
  const skillGap = showMatch ? getSkillGap(job.skills) : [];
  const isApplied = applications.some(app => String(app.jobId) === String(job.id));
  const isSaved = savedJobs.some(savedJob => String(savedJob.id) === String(job.id));
  const applicationLink = job.applicationLink;
  const linkAvailable = Boolean(applicationLink && String(applicationLink).trim().length > 0);

  const matchingSkills = job.skills.filter(skill =>
    student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Top highlight bar for high matches */}
      {matchPercentage >= 80 && (
        <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {job.company}
            </p>
          </div>
          {matchPercentage >= 80 && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              TOP MATCH
            </span>
          )}
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiMapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiClock className="w-4 h-4" />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiDollarSign className="w-4 h-4" />
            <span>{job.stipend}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiCalendar className="w-4 h-4" />
            <span className="text-xs">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            REQUIRED SKILLS
          </p>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <SkillTag
                key={index}
                skill={skill}
                variant={matchingSkills.includes(skill) ? 'success' : 'gray'}
              />
            ))}
          </div>
        </div>

        {/* Match Percentage */}
        {showMatch && (
          <div className="mb-4">
            <ProgressBar percentage={matchPercentage} />
          </div>
        )}

        {/* Skill Gap */}
        {showMatch && skillGap.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Skills to Learn:
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGap.map((skill, index) => (
                <SkillTag key={index} skill={skill} variant="warning" />
              ))}
            </div>
          </div>
        )}

        {/* Expandable Description */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
        >
          <span>{expanded ? 'Hide Details' : 'View Details'}</span>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expanded && (
          <div className="mb-4 animate-slide-down">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {onApply && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (!linkAvailable) return;
                window.open(applicationLink, '_blank', 'noopener,noreferrer');
                const completed = window.confirm(
                  'After finishing the application on the opened website, click OK to save it in My Applications.'
                );
                if (completed) onApply(job.id);
              }}
              disabled={!linkAvailable || isApplied}
              className={`py-3 rounded-lg font-semibold transition-all ${
                !linkAvailable || isApplied
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}
            >
              {isApplied ? 'Already Applied' : linkAvailable ? 'Apply Now' : 'Not available'}
            </button>
            <button
              type="button"
              onClick={() => saveJob(job)}
              disabled={isSaved}
              className={`py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isSaved ? <FiCheck className="w-5 h-5" /> : <FiBookmark className="w-5 h-5" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
