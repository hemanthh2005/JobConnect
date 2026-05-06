# 🚀 FULL-STACK SETUP GUIDE

Welcome to the **JobConnect Full-Stack Application**. 
This guide will walk you through setting up both the **Node.js/Express Backend** and the **React/Vite Frontend** on your local machine.

---

## 1️⃣ Prerequisites Check

Before you begin, ensure you have the following installed on your system:
- ✅ **Node.js** (version 16 or higher)
- ✅ **npm** (comes with Node.js)
- ✅ **MongoDB** (Local installation running on default port `27017`, or a free MongoDB Atlas cluster)
- ✅ A code editor (e.g., VS Code)

---

## 2️⃣ Backend Setup (Node.js & Express)

The backend handles the database connection, user authentication, and fetching live jobs from the Adzuna API.

### Step 1: Navigate and Install
Open your terminal and navigate to the backend folder, then install dependencies:
```bash
cd job-backend
npm install
```

### Step 2: Environment Variables
Create a `.env` file inside the `job-backend` folder (if it doesn't already exist) and add the following keys. 
*Note: You need to sign up at [Adzuna Developer Portal](https://developer.adzuna.com/) to get your free API ID and Key.*

```env
# job-backend/.env
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JSEARCH_API_KEY=your_jsearch_rapidapi_key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
*(If you do not provide API keys, the app will gracefully fallback to showing manually added jobs from the database).*

### Step 3: Start the Backend Server
Ensure your MongoDB service is running locally. Then start the backend server:
```bash
npm start
```
You should see the following messages in the terminal:
```text
Backend is running
MongoDB Connected
Server running on port 5000
```
*The API will now be accessible at `http://localhost:5000`.*

---

## 3️⃣ Frontend Setup (React & Vite)

The frontend is the visual interface built with React and Tailwind CSS.

### Step 1: Navigate and Install
Open a **NEW terminal window/tab** (keep the backend running in the previous one) and navigate to the frontend folder:
```bash
cd job-frontend
npm install
```

### Step 2: Environment Variables
Create a `.env` file inside the `job-frontend` folder (if it doesn't already exist) for Google Login functionality:

```env
# job-frontend/.env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Step 3: Start the Frontend Server
Once the installation is complete, start the Vite development server:
```bash
npm run dev
```
You should see an output similar to:
```text
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 4️⃣ Using the Application

### 1. Open the App
Click the link in your frontend terminal or manually open your browser to: **`http://localhost:3000`**

### 2. Testing the Student Flow (Full-Stack)
1. On the Landing Page, click **Student Login**.
2. If you don't have an account, click the **Sign Up** link in the login form.
3. Fill out your details (Name, Email, Password, College, Graduation Year, Degree, Branch).
   - *This data is saved to your local MongoDB!*
   - *Note: Email format and MX records are deeply validated automatically.*
   - Alternatively, use the **Google Login** button for instant access.
4. Once registered/logged in, you will be redirected to the Student Dashboard.
5. Go to **Upload Resume** to set your skills. (These are saved to the backend).
6. Go to **Browse Jobs** to see live jobs fetched from Adzuna API based on your skills.
7. Click **Apply Now** on a job. Check your **My Applications** tab to see it saved in the database.

### 3. Testing the Admin Flow
*(Note: Admin features are currently simulated on the frontend for demonstration purposes).*
1. Click **Admin Login** on the landing page.
2. Explore the dashboard stats.
3. You can manually add jobs or simulate changing application statuses.

---

## 5️⃣ Troubleshooting

### MongoDB Connection Error
- **Symptom**: Backend crashes with `DB Error: MongoNetworkError` or similar.
- **Fix**: Make sure your local MongoDB server is running. (On Windows, check Services for "MongoDB". On Mac/Linux, run `sudo systemctl start mongod` or `brew services start mongodb-community`). Alternatively, update `config/db.js` with your MongoDB Atlas URI.

### Jobs Not Loading
- **Symptom**: "Browse Jobs" page is empty or shows an error.
- **Fix**: Check your backend terminal. If Adzuna API fails, it usually logs a message. Make sure your `.env` variables are correctly named `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`.

### Frontend Cannot Connect to Backend
- **Symptom**: Login/Signup fails with "Network Error" or "Failed to fetch".
- **Fix**: Ensure the backend server is actively running on port 5000. The frontend expects the backend at `http://localhost:5000`.

### Dark Mode Not Applying
- **Fix**: Try clearing your browser's local storage and refreshing the page.

---

## 🚀 Building for Production

When you are ready to deploy the frontend:
```bash
cd job-frontend
npm run build
```
This will create a `dist` directory with your optimized static assets, ready to be hosted on Vercel, Netlify, or served via Express.

Happy Coding! 🎉
