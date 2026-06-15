export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const KNOWN_SKILLS = [
  'React',
  'JavaScript',
  'Node.js',
  'Express',
  'Python',
  'Java',
  'SQL',
  'MongoDB',
  'HTML',
  'CSS',
  'TypeScript',
  'Machine Learning',
  'AWS',
  'Git',
  'Docker',
  'Kubernetes',
  'Spring Boot',
  'Firebase',
  'Redux',
  'React Native',
  'Figma',
  'Selenium',
  'Tailwind CSS',
];

export const inferSkills = (text, studentSkills = []) => {
  const lowerText = text.toLowerCase();
  const matchedSkills = [...KNOWN_SKILLS, ...studentSkills].filter((skill) =>
    lowerText.includes(String(skill).toLowerCase())
  );
  const uniqueSkills = [...new Set(matchedSkills)];

  return uniqueSkills.length > 0 ? uniqueSkills.slice(0, 8) : ['Communication', 'Problem Solving'];
};

export const normalizeAdzunaJob = (job, studentSkills = []) => {
  if (job.id && job.title && job.company && Array.isArray(job.skills)) {
    return job;
  }

  const text = `${job.title || ''} ${job.description || ''}`;
  const skills = inferSkills(text, studentSkills);

  return {
    id: job.id || job.redirect_url,
    title: job.title || 'Job Opportunity',
    company: job.company?.display_name || 'Company not listed',
    location: job.location?.display_name || 'India',
    type: /intern/i.test(text) ? 'Internship' : 'Full-time',
    duration: /intern/i.test(text) ? 'Internship' : 'Permanent',
    stipend: job.salary_min
      ? `Rs. ${Math.round(job.salary_min).toLocaleString('en-IN')}/year`
      : 'Not disclosed',
    skills,
    description: job.description || 'No description available.',
    requirements: skills.map((skill) => `Knowledge of ${skill}`),
    postedDate: job.created?.split('T')[0] || new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    applicationLink: job.redirect_url,
  };
};

export const fetchLiveJobs = async ({
  student,
  skill,
  location = 'India',
  results = 30,
} = {}) => {
  const params = new URLSearchParams({
    location,
    results: String(results),
  });

  if (skill) params.set('skill', skill);
  if (student?.email) params.set('email', student.email);
  if (student?.degree) params.set('degree', student.degree);
  if (student?.branch) params.set('branch', student.branch);
  if (student?.skills?.length) params.set('skills', student.skills.join(','));

  const res = await fetch(`${API_URL}/jobs?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch jobs');
  }

  const rawJobs = Array.isArray(data) ? data : data.jobs || [];

  return {
    ...data,
    jobs: rawJobs.map((job) => normalizeAdzunaJob(job, student?.skills || [])),
  };
};
