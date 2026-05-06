import { createContext, useContext, useState, useEffect } from 'react';
import { jobsData } from '../data/jobs';
import { studentProfile } from '../data/student';
import { API_URL, fetchLiveJobs as fetchLiveJobsFromApi } from '../utils/jobsApi';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // User role (student or admin). Stored in localStorage for persistence.
  const [userRoleState, setUserRoleState] = useState(() => {
    const savedRole = localStorage.getItem('jobconnect_role');
    return savedRole ? savedRole : null;
  });

  const setUserRole = (role) => {
    setUserRoleState(role);
    if (role) localStorage.setItem('jobconnect_role', role);
    else localStorage.removeItem('jobconnect_role');
  };

  // Student data
  const [student, setStudentState] = useState(() => {
    const savedStudent = localStorage.getItem('jobconnect_student');
    return savedStudent ? JSON.parse(savedStudent) : studentProfile;
  });

  const setStudent = (studentData) => {
    const nextStudent = {
      ...studentProfile,
      ...studentData,
      skills: studentData?.skills || studentProfile.skills,
      resumeUploaded: studentData?.resumeUploaded ?? studentProfile.resumeUploaded,
      profileComplete: studentData?.profileComplete || studentProfile.profileComplete,
    };

    setStudentState(nextStudent);
    localStorage.setItem('jobconnect_student', JSON.stringify(nextStudent));
  };

  const logout = () => {
    setUserRoleState(null);
    setStudentState(studentProfile);
    localStorage.removeItem('jobconnect_role');
    localStorage.removeItem('jobconnect_student');
  };

  // Jobs data
  const [jobs, setJobs] = useState(jobsData);

  // Applications data
  const [applications, setApplications] = useState([]);

  // Saved jobs data
  const [savedJobs, setSavedJobs] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Update dark mode in localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const loadStudentJobData = async () => {
      if (userRoleState !== 'student' || !student.email) {
        setApplications([]);
        setSavedJobs([]);
        return;
      }

      try {
        const [applicationsRes, savedJobsRes] = await Promise.all([
          fetch(`${API_URL}/applications?email=${encodeURIComponent(student.email)}`),
          fetch(`${API_URL}/saved-jobs?email=${encodeURIComponent(student.email)}`),
        ]);

        if (applicationsRes.ok) {
          setApplications(await applicationsRes.json());
        }

        if (savedJobsRes.ok) {
          setSavedJobs(await savedJobsRes.json());
        }
      } catch {
        addNotification('Could not load applications and saved jobs from database.', 'warning');
      }
    };

    loadStudentJobData();
  }, [student.email, userRoleState]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Update student skills
  const updateStudentSkills = (newSkills) => {
    setStudentState(prev => {
      const nextStudent = {
        ...prev,
        skills: newSkills,
        resumeUploaded: true
      };

      localStorage.setItem('jobconnect_student', JSON.stringify(nextStudent));

      if (nextStudent.email) {
        fetch(`http://localhost:5000/profile/${encodeURIComponent(nextStudent.email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills: newSkills,
            resumeUploaded: true,
          }),
        }).catch(() => {
          addNotification('Skills saved locally, but backend sync failed.', 'warning');
        });
      }

      return nextStudent;
    });
  };

  const fetchLiveJobs = async ({ skill, location = 'India', results = 30 } = {}) => {
    const data = await fetchLiveJobsFromApi({
      student,
      skill,
      location,
      results,
    });
    setJobs(data.jobs);
    return data;
  };

  // Apply to a job
  const applyToJob = async (jobOrId) => {
    const jobId = typeof jobOrId === 'object' ? jobOrId?.id : jobOrId;
    const job = typeof jobOrId === 'object'
      ? jobOrId
      : jobs.find(j => String(j.id) === String(jobId));
    const alreadyApplied = applications.some(app => String(app.jobId) === String(jobId));

    if (!job) {
      addNotification('Job details are not available. Please refresh jobs and try again.', 'warning');
      return false;
    }

    if (alreadyApplied) {
      addNotification('You have already applied to this job!', 'warning');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: student.email,
          jobId: job.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save application');
      }

      setApplications(prev => {
        if (prev.some(app => app.jobId === data.jobId)) return prev;
        return [...prev, data];
      });
      addNotification(`Successfully applied to ${job.title}!`, 'success');
      return true;
    } catch (error) {
      addNotification(error.message || 'Application could not be saved in database.', 'warning');
      return false;
    }
  };

  // Update application status (admin)
  const updateApplicationStatus = async (appId, newStatus) => {
    if (userRoleState !== 'admin') {
      addNotification('Only admin can update application status.', 'warning');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Status update failed');
      }

      setApplications(prev =>
        prev.map(app =>
          app.id === appId ? data : app
        )
      );
      addNotification(`Application status updated to ${newStatus}`, 'success');
      return true;
    } catch (error) {
      addNotification(error.message || 'Status update failed.', 'warning');
      return false;
    }
  };

  // Save a job
  const saveJob = async (job) => {
    const alreadySaved = savedJobs.some(s => String(s.id) === String(job.id));

    if (alreadySaved) {
      addNotification('This job is already saved!', 'warning');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/saved-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: student.email,
          jobId: job.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save job');
      }

      setSavedJobs(prev => {
        if (prev.some(saved => saved.id === data.id)) return prev;
        return [...prev, data];
      });
      addNotification(`${job.title} saved!`, 'success');
      return true;
    } catch (error) {
      addNotification(error.message || 'Saved job could not be stored in database.', 'warning');
      return false;
    }
  };

  // Remove from saved jobs
  const removeFromSaved = async (jobId) => {
    try {
      const res = await fetch(
        `${API_URL}/saved-jobs/${jobId}?email=${encodeURIComponent(student.email)}`,
        { method: 'DELETE' }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to remove saved job');
      }

      setSavedJobs(prev => prev.filter(job => String(job.id) !== String(jobId)));
      addNotification('Removed from saved jobs', 'info');
    } catch (error) {
      addNotification(error.message || 'Could not remove saved job.', 'warning');
    }
  };

  // Add a new job (admin)
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now(),
      postedDate: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
    addNotification('Job posted successfully!', 'success');
    return newJob;
  };

  // Delete a job (admin)
  const deleteJob = (jobId) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    addNotification('Job deleted successfully!', 'success');
  };

  // Update a job (admin)
  const updateJob = (jobId, updatedData) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, ...updatedData } : job
      )
    );
    addNotification('Job updated successfully!', 'success');
  };

  // Calculate match percentage
  const calculateMatchPercentage = (jobSkills) => {
    if (!jobSkills || jobSkills.length === 0) return 0;
    const matchingSkills = jobSkills.filter(skill =>
      student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
  };

  // Get recommended jobs
  const getRecommendedJobs = () => {
    return jobs
      .map(job => ({
        ...job,
        matchPercentage: calculateMatchPercentage(job.skills)
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 6);
  };

  // Get skill gap for a job
  const getSkillGap = (jobSkills) => {
    return jobSkills.filter(
      skill => !student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const value = {
    darkMode,
    toggleDarkMode,
    userRole: userRoleState,
    setUserRole,
    logout,
    student,
    setStudent,
    updateStudentSkills,
    jobs,
    fetchLiveJobs,
    addJob,
    deleteJob,
    updateJob,
    applications,
    applyToJob,
    updateApplicationStatus,
    savedJobs,
    saveJob,
    removeFromSaved,
    calculateMatchPercentage,
    getRecommendedJobs,
    getSkillGap,
    notifications,
    addNotification,
    removeNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
