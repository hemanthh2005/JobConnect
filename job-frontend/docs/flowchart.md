# Flowchart for Job / Internship System

## Main System Flow

```text
Start
  |
  v
Open Application
  |
  v
Student Login / Signup
  |
  v
Send Details to Backend
  |
  v
Validate Student Data
  |
  +--> Invalid Details --> Show Error --> Login / Signup
  |
  v
Store / Fetch Student from MongoDB
  |
  v
Student Dashboard
  |
  +--> View / Update Profile --> Save Profile to MongoDB
  |
  +--> Upload Resume / Skills --> Update Student Skills
  |
  +--> Browse Jobs
          |
          v
       Request Jobs from Backend
          |
          v
       Backend Calls Adzuna API
          |
          v
       Display Job Listings
          |
          +--> Apply Job --> Save Application
          |
          +--> Save Job --> Save Bookmark
          |
          v
       View Applications / Saved Jobs
```

## Flow Explanation

1. The student opens the React frontend.
2. The student logs in or signs up.
3. The frontend sends data to the Express backend.
4. The backend validates student details.
5. Student data is stored or fetched from MongoDB.
6. After successful login, the student reaches the dashboard.
7. The student can update profile, upload skills, browse jobs, apply for jobs, or save jobs.
8. Jobs are fetched through the backend from the Adzuna Jobs API.
9. Applications and saved jobs are shown in the student application page.

## Important Note

In the current project, applications and saved jobs are stored in frontend localStorage. In the final recommended design, they should be stored in MongoDB collections named `applications` and `saved_jobs`.

