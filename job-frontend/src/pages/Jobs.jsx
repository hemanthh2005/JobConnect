import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiBriefcase } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Jobs = () => {
  const { student, fetchLiveJobs, applyToJob } = useApp();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSkills, setFilterSkills] = useState([]);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const [liveQuery, setLiveQuery] = useState('');
  const [manualSkill, setManualSkill] = useState('');
  const skillDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const jobTypes = ['all', 'Full-time', 'Internship'];
  const allSkills = Array.from(new Set(jobs.flatMap((job) => job.skills || []))).sort();

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setIsSkillDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchLiveJobs({
        location: location || 'India',
        results: 30,
        skill: filterSkills.length > 0 ? filterSkills.join(' ') : undefined,
      });

      setLiveQuery(data.query || '');
      setJobs(data.jobs);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [student.email, student.degree, student.branch, student.skills]);

  useEffect(() => {
    let result = jobs;

    if (filterType !== 'all') {
      result = result.filter((job) => job.type === filterType);
    }

    if (filterSkills.length > 0) {
      const selectedSkills = new Set(filterSkills.map(s => s.toLowerCase()));
      result = result.filter((job) =>
        job.skills.some((skill) => selectedSkills.has(skill.toLowerCase()))
      );
    }

    setFilteredJobs(result);
  }, [filterType, filterSkills, jobs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <FiBriefcase className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">Browse Real Jobs</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Explore {jobs.length} recent opportunities matched to your skills and education
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div ref={typeDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type
            </label>
            <button
              type="button"
              onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
              className="w-full text-left pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-between focus:ring-2 focus:ring-blue-500"
            >
              <span>
                {filterType === 'all' ? 'All Types' : filterType}
              </span>
              <FiFilter className="w-5 h-5 text-gray-500" />
            </button>
            {isTypeDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg max-h-64 overflow-y-auto p-3">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFilterType(type);
                      setIsTypeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={skillDropdownRef} className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Skills
              </label>
              {filterSkills.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterSkills([])}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear skills
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsSkillDropdownOpen((prev) => !prev)}
              className="w-full text-left pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-between focus:ring-2 focus:ring-blue-500"
            >
              <span>
                {filterSkills.length > 0
                  ? `${filterSkills.length} selected`
                  : 'Select skills...'}
              </span>
              <FiFilter className="w-5 h-5 text-gray-500" />
            </button>
            {isSkillDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg max-h-80 overflow-y-auto p-3">
                <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type skill name..."
                      value={manualSkill}
                      onChange={(e) => setManualSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && manualSkill.trim()) {
                          if (!filterSkills.includes(manualSkill.trim())) {
                            setFilterSkills([...filterSkills, manualSkill.trim()]);
                          }
                          setManualSkill('');
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (manualSkill.trim() && !filterSkills.includes(manualSkill.trim())) {
                          setFilterSkills([...filterSkills, manualSkill.trim()]);
                          setManualSkill('');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {allSkills.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterSkills.includes(skill)}
                      onChange={() =>
                        setFilterSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((item) => item !== skill)
                            : [...prev, skill]
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {filterSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              {filterSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setFilterSkills(filterSkills.filter((s) => s !== skill))}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <span className="font-medium">Showing {filteredJobs.length} jobs</span>
          {liveQuery && (
            <span className="text-gray-500 dark:text-gray-400">
              Search: {liveQuery}
            </span>
          )}
          {(filterType !== 'all' || filterSkills.length > 0) && (
            <button
              onClick={() => {
                setFilterType('all');
                setFilterSkills([]);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          )}
          <button
            onClick={fetchJobs}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Jobs
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showMatch={true}
              onApply={applyToJob}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FiBriefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try another skill or location.
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setFilterSkills([]);
              fetchJobs();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
