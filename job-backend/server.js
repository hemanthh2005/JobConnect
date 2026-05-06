require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
const { OAuth2Client } = require('google-auth-library');
const emailValidator = require('deep-email-validator');

const connectDB = require("./config/db");
const Student = require("./models/Student");
const Job = require("./models/Job");
const Application = require("./models/Application");
const SavedJob = require("./models/SavedJob");

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

connectDB();

app.use(cors());
app.use(express.json());
console.log("Backend is running");

const KNOWN_SKILLS = [
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "Python",
  "Java",
  "SQL",
  "MongoDB",
  "HTML",
  "CSS",
  "TypeScript",
  "Machine Learning",
  "AWS",
  "Git",
  "Docker",
  "Kubernetes",
  "Spring Boot",
  "Firebase",
  "Redux",
  "React Native",
  "Figma",
  "Selenium",
  "Tailwind CSS",
];

const toDateString = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const inferSkills = (text, studentSkills = []) => {
  const lowerText = String(text || "").toLowerCase();
  const matchedSkills = [...KNOWN_SKILLS, ...studentSkills].filter((skill) =>
    lowerText.includes(String(skill).toLowerCase())
  );
  const uniqueSkills = [...new Set(matchedSkills)];

  return uniqueSkills.length > 0
    ? uniqueSkills.slice(0, 8)
    : ["Communication", "Problem Solving"];
};

const formatJob = (job) => ({
  id: String(job._id),
  title: job.title,
  company: job.company,
  location: job.location,
  type: job.type,
  duration: job.duration,
  stipend: job.stipend,
  skills: job.skills || [],
  description: job.description,
  requirements: job.requirements || [],
  postedDate: toDateString(job.postedDate),
  deadline: toDateString(job.deadline),
  applicationLink: job.applicationLink,
  source: job.source,
  externalJobId: job.externalJobId,
});

const formatApplication = (application) => ({
  id: String(application._id),
  jobId: String(application.jobId?._id || application.jobId),
  jobTitle: application.jobId?.title || application.jobTitle,
  company: application.jobId?.company || application.company,
  appliedDate: toDateString(application.appliedDate),
  status: application.status,
});

const formatSavedJob = (savedJob) => {
  const job = savedJob.jobId;

  return {
    ...formatJob(job),
    savedRecordId: String(savedJob._id),
    savedDate: toDateString(savedJob.savedDate),
  };
};

const normalizeAdzunaJob = (job, studentSkills = []) => {
  const text = `${job.title || ""} ${job.description || ""}`;
  const skills = inferSkills(text, studentSkills);

  return {
    externalJobId: String(job.id || job.redirect_url),
    title: job.title || "Job Opportunity",
    company: job.company?.display_name || "Company not listed",
    location: job.location?.display_name || "India",
    type: /intern/i.test(text) ? "Internship" : "Full-time",
    duration: /intern/i.test(text) ? "Internship" : "Permanent",
    stipend: job.salary_min
      ? `Rs. ${Math.round(job.salary_min).toLocaleString("en-IN")}/year`
      : "Not disclosed",
    skills,
    description: job.description || "No description available.",
    requirements: skills.map((skill) => `Knowledge of ${skill}`),
    postedDate: job.created ? new Date(job.created) : new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationLink: job.redirect_url,
    source: "adzuna",
  };
};

const normalizeJSearchJob = (job, studentSkills = []) => {
  const text = `${job.job_title || ""} ${job.job_description || ""}`;
  const skills = inferSkills(text, studentSkills);

  const stipendStr = job.job_salary_string 
    ? job.job_salary_string 
    : (job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : "Not disclosed");

  return {
    externalJobId: String(job.job_id),
    title: job.job_title || "Job Opportunity",
    company: job.employer_name || "Company not listed",
    location: `${job.job_city || ""}, ${job.job_country || ""}`.replace(/^, |^,/g, '').trim() || "Remote",
    type: job.job_employment_type && job.job_employment_type.toLowerCase().includes('intern') ? "Internship" : "Full-time",
    duration: /intern/i.test(text) ? "Internship" : "Permanent",
    stipend: stipendStr,
    skills,
    description: job.job_description || "No description available.",
    requirements: skills.map((skill) => `Knowledge of ${skill}`),
    postedDate: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationLink: job.job_apply_link,
    source: "jsearch",
  };
};

const findStudentByEmail = async (email) => {
  if (!email) return null;
  return Student.findOne({ email });
};

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      graduationYear,
      degree,
      branch,
    } = req.body;
    const requiredFields = {
      name,
      email,
      password,
      college,
      graduationYear,
      degree,
      branch,
    };
    const missingField = Object.keys(requiredFields).find(
      (field) => !requiredFields[field]
    );

    if (missingField) {
      return res.status(400).json({ message: "All signup fields are required" });
    }

    // Deep Email Validation (Format, Typos, Disposable, MX Records, SMTP)
    const { valid, reason, validators } = await emailValidator.validate(email);
    if (!valid && reason !== 'smtp') {
      // Sometimes SMTP checks fail depending on network/provider, so we allow smtp failures if MX exists
      return res.status(400).json({ message: `Invalid email address: ${validators[reason]?.reason || reason}` });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const student = await Student.create({
      name,
      email,
      password,
      college,
      graduationYear,
      degree,
      branch,
      profileComplete: 85,
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email, password });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login success",
      role: "student",
      user: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.password === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as old password",
      });
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    let student = await Student.findOne({ email });
    
    if (!student) {
      // Create new student without password
      student = await Student.create({
        name,
        email,
        profileComplete: 40,
      });
    }
    
    res.json({ message: "Google Login successful", user: student });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

app.get("/profile/:email", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/profile/:email", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const {
      skill = "react intern",
      location = "India",
      results = 30,
      skills = "",
    } = req.query;
    
    const { ADZUNA_APP_ID, ADZUNA_APP_KEY, JSEARCH_API_KEY, JSEARCH_API_HOST } = process.env;

    const studentSkills = String(skills)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // 1. Fetcher for Adzuna
    const fetchAdzuna = async () => {
      if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];
      const url = "https://api.adzuna.com/v1/api/jobs/in/search/1" +
        `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
        `&what=${encodeURIComponent(skill)}&where=${encodeURIComponent(location)}` +
        `&results_per_page=${encodeURIComponent(results)}&max_days_old=30`;
      
      const response = await fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      return (data.results || []).map((job) => normalizeAdzunaJob(job, studentSkills));
    };

    // 2. Fetcher for JSearch
    const fetchJSearch = async () => {
      console.log("JSEARCH_API_KEY present:", !!JSEARCH_API_KEY);
      if (!JSEARCH_API_KEY) {
        console.log("JSearch skipped because API key is missing. (Did you restart the server?)");
        return [];
      }
      const query = `${skill} jobs in ${location}`;
      const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&date_posted=all`;
      
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-host': JSEARCH_API_HOST || 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': JSEARCH_API_KEY
        }
      };
      
      try {
        const response = await fetch(url, options);
        console.log("JSearch Response Status:", response.status);
        if (!response.ok) {
          console.error("JSearch Error Response:", await response.text());
          return [];
        }
        const data = await response.json();
        let rawJsearchJobs = [];
        if (Array.isArray(data.data)) {
          rawJsearchJobs = data.data;
        } else if (data.data && Array.isArray(data.data.jobs)) {
          rawJsearchJobs = data.data.jobs;
        } else if (Array.isArray(data.jobs)) {
          rawJsearchJobs = data.jobs;
        }
        
        console.log("JSearch returned jobs:", rawJsearchJobs.length);
        return rawJsearchJobs.map((job) => normalizeJSearchJob(job, studentSkills));
      } catch (err) {
        console.error("JSearch Fetch Error:", err);
        return [];
      }
    };

    // 3. Execute both fetches concurrently
    const [adzunaJobsData, jsearchJobsData] = await Promise.allSettled([
      fetchAdzuna(),
      fetchJSearch()
    ]);

    const adzunaJobs = adzunaJobsData.status === "fulfilled" ? adzunaJobsData.value : [];
    const jsearchJobs = jsearchJobsData.status === "fulfilled" ? jsearchJobsData.value : [];

    // Combine results
    let combinedJobs = [...adzunaJobs, ...jsearchJobs];

    // 4. Deduplicate based on title and company
    const seenJobs = new Set();
    const uniqueJobs = [];
    
    for (const job of combinedJobs) {
      if (!job.title || !job.company) continue;
      const uniqueKey = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (!seenJobs.has(uniqueKey)) {
        seenJobs.add(uniqueKey);
        uniqueJobs.push(job);
      }
    }

    if (uniqueJobs.length === 0) {
      // Fallback to database
      const storedJobs = await Job.find().sort({ postedDate: -1 }).limit(Number(results));
      return res.json({
        query: skill,
        location,
        source: "database",
        message: "No live jobs fetched. Showing stored jobs from database.",
        jobs: storedJobs.map(formatJob),
      });
    }

    // 5. Upsert unique jobs to Database
    const savedJobs = await Promise.all(
      uniqueJobs.map((normalizedJob) => {
        return Job.findOneAndUpdate(
          { externalJobId: normalizedJob.externalJobId },
          normalizedJob,
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      })
    );

    res.json({
      query: skill,
      location,
      source: "multiple-apis",
      jobs: savedJobs.map(formatJob),
    });
  } catch (error) {
    console.error("Job Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.get("/applications", async (req, res) => {
  try {
    const student = await findStudentByEmail(req.query.email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate("jobId")
      .sort({ appliedDate: -1 });

    res.json(applications.map(formatApplication));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/applications", async (req, res) => {
  try {
    const { email, jobId } = req.body;
    const student = await findStudentByEmail(email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await Application.findOneAndUpdate(
      { studentId: student._id, jobId: job._id },
      {
        studentId: student._id,
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        status: "Applied",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("jobId");

    res.status(201).json(formatApplication(application));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(formatApplication(application));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/saved-jobs", async (req, res) => {
  try {
    const student = await findStudentByEmail(req.query.email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const savedJobs = await SavedJob.find({ studentId: student._id })
      .populate("jobId")
      .sort({ savedDate: -1 });

    res.json(savedJobs.filter((item) => item.jobId).map(formatSavedJob));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/saved-jobs", async (req, res) => {
  try {
    const { email, jobId } = req.body;
    const student = await findStudentByEmail(email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const savedJob = await SavedJob.findOneAndUpdate(
      { studentId: student._id, jobId: job._id },
      { studentId: student._id, jobId: job._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("jobId");

    res.status(201).json(formatSavedJob(savedJob));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/saved-jobs/:jobId", async (req, res) => {
  try {
    const student = await findStudentByEmail(req.query.email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await SavedJob.findOneAndDelete({
      studentId: student._id,
      jobId: req.params.jobId,
    });

    res.json({ message: "Saved job removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
