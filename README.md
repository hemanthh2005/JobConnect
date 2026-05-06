# 🎯 JobConnect - Full-Stack Job Recommendation System

A modern, full-stack application for job recommendations, application tracking, and profile management. This project is built using the **MERN** stack (MongoDB, Express, React, Node.js) and integrates with the **Adzuna** and **JSearch APIs** to fetch live job postings.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express-API-lightgray)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success)

---

## 🌟 Features

### Full-Stack Architecture
- **Backend API**: Node.js & Express server handling authentication, job fetching, applications, and saved jobs.
- **Database**: MongoDB using Mongoose schemas for Students, Jobs, Applications, and SavedJobs.
- **Frontend App**: React (Vite) app utilizing Context API, React Router, and Tailwind CSS.
- **Live Data**: Integration with Adzuna API for real-time job listings based on skills and location.

### Student Portal
- ✅ **Secure Authentication** - Standard email sign-up (with deep MX record validation) and **Google OAuth Login**.
- ✅ **Smart Job Matching** - AI-powered recommendations matching your skills against live job descriptions.
- ✅ **Live Job Search** - Search for jobs fetched dynamically from multiple sources (Adzuna & JSearch APIs).
- ✅ **Custom Skill Filtering** - Manually type and add custom skills to instantly fetch relevant jobs.
- ✅ **Application Tracking** - Apply to jobs and track your application status dynamically.
- ✅ **Save Jobs** - Bookmark your favorite jobs for later review.
- ✅ **Match Percentage** - Visual progress bars showing job compatibility based on your profile skills.

### Admin Portal (Frontend Simulation)
- ✅ **Job Management** - Add, edit, and delete job postings.
- ✅ **Application Management** - Review and update student application statuses.
- ✅ **Dashboard Analytics** - View stats and metrics.

### UI/UX Features
- ✨ Beautiful gradient backgrounds & modern card-based layouts.
- 🌙 Complete Dark/Light Mode support.
- 📱 Fully responsive design (mobile, tablet, desktop).
- 🔔 Toast notifications for real-time feedback on user actions.

---

## 📁 Project Structure

This is a monorepo setup containing both backend and frontend directories:

```text
job-recommendation-final/
├── job-backend/             # Node.js + Express Backend
│   ├── config/              # Database connection setup
│   ├── models/              # Mongoose schemas (Student, Job, Application, SavedJob)
│   ├── server.js            # Main Express server and API routes
│   └── package.json         # Backend dependencies
│
├── job-frontend/            # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, JobCard, etc.)
│   │   ├── context/         # AppContext for global state management
│   │   ├── pages/           # Pages (Dashboard, Jobs, Applications, Login, etc.)
│   │   ├── utils/           # Helper functions and API utilities
│   │   ├── App.jsx          # Main App routing
│   │   └── main.jsx         # Vite entry point
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Frontend dependencies
│
├── README.md                # This file
└── SETUP_GUIDE.md           # Step-by-step setup instructions
```

---

## 🚀 Getting Started

To get the project up and running on your local machine, please follow the detailed instructions in the **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** file.

### Prerequisites Overview
- **Node.js** (v16+)
- **MongoDB** (running locally on default port 27017 or a MongoDB Atlas URI)
- **Adzuna API Keys** (App ID and App Key)

---

## 🎨 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18.2, Vite, Tailwind CSS 3.3 | UI, routing, and state management |
| **Backend** | Node.js, Express.js | API creation, business logic, route handling |
| **Database** | MongoDB, Mongoose | Data persistence, schema validation |
| **Authentication** | Google Auth Library, React OAuth | Secure standard and Google Single Sign-On |
| **External API** | Adzuna Jobs API, JSearch API | Fetching real job postings dynamically |
| **Styling** | Tailwind CSS, React Icons | Utility-first styling and iconography |

---

## 📊 Database Models

The backend utilizes MongoDB with the following core collections:

1. **Student**: Stores user details (`name`, `email`, `password`, `skills`, `degree`, etc.).
2. **Job**: Stores job details either posted manually or cached from Adzuna (`title`, `company`, `skills`, `externalJobId`).
3. **Application**: Links a `Student` and a `Job` with an application `status` (e.g., "Applied", "Selected").
4. **SavedJob**: Bookmarks a `Job` for a specific `Student`.

---

## 💡 Key Full-Stack Features Explained

### Smart Job Matching & External API
When a user searches for jobs or loads recommendations, the Express backend calls the **Adzuna API**. 
The backend parses the job descriptions to **infer required skills** from a known list of tech skills. 
These skills are then compared to the student's saved profile skills on the frontend to calculate a **Match Percentage**.

### Application & Saved Job Tracking
Instead of relying purely on local storage, the backend persists applications and saved jobs in MongoDB. 
When a user logs in, the `AppContext` fetches their personalized data from the Express API, ensuring data consistency across sessions.

---

## 📄 License

This is an academic/portfolio project. Feel free to use for learning purposes.

---

## 📞 Support

For any questions or issues during setup, please review the `SETUP_GUIDE.md` first. Check the terminal outputs for both the frontend (Vite) and backend (Node/Express) for any detailed error logs.
