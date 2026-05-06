# Design Architecture for Job / Internship System

## Architecture Type

The project follows a 3-tier web application architecture:

1. Presentation Layer
2. Application / API Layer
3. Database Layer

## 1. Presentation Layer

Technology:

```text
React.js + Vite + Tailwind CSS
```

Responsibilities:

- Displays student login and signup pages.
- Displays student dashboard.
- Shows student profile.
- Allows students to update profile and skills.
- Shows job listings.
- Allows students to apply for jobs.
- Allows students to save jobs.
- Shows applications and saved jobs.
- Stores temporary frontend state using React Context and localStorage.

Important frontend modules:

| Module | Purpose |
| --- | --- |
| `App.jsx` | Main route configuration |
| `AppContext.jsx` | Global state management |
| `StudentLogin.jsx` | Login, signup, and forgot password |
| `StudentProfile.jsx` | Student profile update |
| `Jobs.jsx` | Job browsing and filtering |
| `Applications.jsx` | Applied and saved jobs |
| `UploadResume.jsx` | Resume/skill upload flow |
| `jobsApi.js` | API helper for live jobs |

## 2. Application / API Layer

Technology:

```text
Node.js + Express.js
```

Responsibilities:

- Handles student signup.
- Handles student login.
- Handles forgot password.
- Handles profile fetch/update.
- Connects to MongoDB.
- Fetches live jobs from Adzuna API.
- Sends JSON responses to the React frontend.

Important backend modules:

| Module | Purpose |
| --- | --- |
| `server.js` | Main backend server and API routes |
| `config/db.js` | MongoDB connection |
| `models/Student.js` | Student database schema |

Main API endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health check |
| `POST` | `/signup` | Register student |
| `POST` | `/login` | Login student |
| `POST` | `/forgot-password` | Reset password |
| `GET` | `/profile/:email` | Get student profile |
| `PUT` | `/profile/:email` | Update student profile |
| `GET` | `/jobs` | Fetch live jobs from Adzuna |

## 3. Database Layer

Technology:

```text
MongoDB + Mongoose
```

Current database:

```text
jobApp
```

Current collection:

```text
students
```

Recommended final collections:

1. `students`
2. `jobs`
3. `applications`
4. `saved_jobs`

The old `User.js` model is not part of the final architecture because it is unused in the current backend.

## 4. External Service Layer

Technology:

```text
Adzuna Jobs API
```

Purpose:

- The backend calls Adzuna API to fetch live job listings.
- The frontend normalizes and displays the job data.

## System Flow

### Student Signup / Login Flow

1. Student enters details in React frontend.
2. Frontend sends request to Express backend.
3. Backend validates request.
4. Backend stores/fetches student data from MongoDB.
5. Backend sends response to frontend.
6. Frontend stores logged-in student data in localStorage and React Context.

### Job Browsing Flow

1. Student opens jobs page.
2. Frontend calls backend `/jobs` endpoint.
3. Backend calls Adzuna API.
4. Backend returns live jobs to frontend.
5. Frontend normalizes job data and displays job cards.

### Apply / Save Job Flow

Current implementation:

1. Student clicks apply or save.
2. Frontend stores application/saved job in localStorage.
3. Applications page reads the data from React Context/localStorage.

Recommended final implementation:

1. Student clicks apply or save.
2. Frontend sends request to backend.
3. Backend stores the record in MongoDB.
4. Applications and saved jobs are loaded from database.

## Architecture Diagram

```text
+-----------------------------+
|        React Frontend        |
|  Vite + Tailwind + Context   |
+--------------+--------------+
               |
               | HTTP / JSON
               v
+--------------+--------------+
|       Express Backend        |
| Node.js API + Business Logic |
+------+---------------+------+
       |               |
       | Mongoose      | REST API
       v               v
+------+-------+   +---+----------------+
|   MongoDB    |   |   Adzuna Jobs API  |
|   jobApp     |   |   Live Job Data    |
+--------------+   +--------------------+
```

## Architecture Summary

The system uses React as the client-side presentation layer, Express as the backend API layer, MongoDB as the database layer, and Adzuna API as an external job data provider. The current project stores only student data in MongoDB, while jobs, applications, and saved jobs should be moved fully to backend collections for a complete production-ready architecture.

