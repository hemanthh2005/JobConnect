import { useState } from 'react';
import { FiBookmark, FiFileText, FiCalendar, FiHome, FiClock, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const Applications = () => {
  const { applications, savedJobs, removeFromSaved, applyToJob } = useApp();
  const [filter, setFilter] = useState('all');

  const appliedItems = applications.map((application) => ({
    ...application,
    type: 'applied',
    displayDate: application.appliedDate,
    status: application.status || 'Applied',
  }));

  const savedItems = savedJobs.map((job) => ({
    ...job,
    type: 'saved',
    jobTitle: job.title,
    displayDate: job.savedDate,
    status: 'Saved',
  }));

  const allItems = [...appliedItems, ...savedItems].sort(
    (a, b) => new Date(b.displayDate) - new Date(a.displayDate)
  );

  const filteredItems = filter === 'all'
    ? allItems
    : allItems.filter(item => item.type === filter);

  const filterOptions = [
    { key: 'all', label: 'Total', count: allItems.length },
    { key: 'applied', label: 'Applied', count: appliedItems.length },
    { key: 'saved', label: 'Saved', count: savedItems.length },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <FiFileText className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">My Applications</h1>
        </div>
        <p className="text-purple-100 text-lg">
          Track all your job applications in one place
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: allItems.length, color: 'bg-blue-500' },
          { label: 'Applied', value: appliedItems.length, color: 'bg-green-500' },
          { label: 'Saved', value: savedItems.length, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
          >
            <div className={`${stat.color} w-2 h-2 rounded-full mb-2`}></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show:
          </span>
          {filterOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {item.jobTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiHome className="w-4 h-4" />
                          {item.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {item.type === 'saved' ? 'Saved' : 'Applied'}: {new Date(item.displayDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <StatusBadge status={item.status} />
                  </div>

                  {item.type === 'saved' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.applicationLink && (
                        <button
                          type="button"
                          onClick={() => {
                            window.open(item.applicationLink, '_blank', 'noopener,noreferrer');
                            const completed = window.confirm(
                              'After finishing the application on the opened website, click OK to save it in My Applications.'
                            );
                            if (completed) applyToJob(item);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center gap-1.5"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          Apply
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromSaved(item.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center gap-1.5"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Timeline indicator */}
                <div className="flex md:flex-col items-center md:items-end gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.type === 'saved' ? <FiBookmark className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                    <span>
                      {Math.floor((new Date() - new Date(item.displayDate)) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FiFileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {filter === 'all' ? 'No applications or saved jobs yet' : `No ${filter} jobs yet`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filter === 'all'
              ? 'Apply to jobs or save them to see them here'
              : 'Try selecting a different view'
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => window.location.href = '/student/jobs'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;
