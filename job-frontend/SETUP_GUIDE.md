# 🚀 QUICK START GUIDE

## Step-by-Step Setup Instructions

### 1️⃣ Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js (version 16 or higher)
- ✅ npm (comes with Node.js)
- ✅ A code editor (VS Code recommended)
- ✅ A modern web browser (Chrome, Firefox, Edge)

**Check your versions:**
```bash
node --version    # Should be v16.x.x or higher
npm --version     # Should be 8.x.x or higher
```

---

### 2️⃣ Installation Steps

#### Option A: Using Terminal
```bash
# Navigate to the project folder
cd job-recommendation-system

# Install all dependencies
npm install

# Start the development server
npm run dev
```

#### Option B: Using VS Code
1. Open the `job-recommendation-system` folder in VS Code
2. Open Terminal (View → Terminal or Ctrl+`)
3. Run: `npm install`
4. Run: `npm run dev`

---

### 3️⃣ Opening the Application

After running `npm run dev`, you'll see:
```
  VITE v5.0.8  ready in 423 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Click the URL or open browser and go to: `http://localhost:3000`**

---

### 4️⃣ First Time Usage

#### Landing Page
You'll see a beautiful landing page with:
- 🎯 Project title and description
- 💼 Two login buttons: "Student Login" and "Admin Login"
- 📊 Statistics (1000+ Jobs, 500+ Companies, 95% Success Rate)
- ✨ Feature highlights

#### Student Login Flow
1. Click **"Student Login"** button
2. You'll be redirected to the Student Dashboard
3. Explore:
   - 📊 Dashboard with stats
   - 💼 Top recommended jobs
   - 📄 Upload resume feature
   - 🔍 Browse all jobs
   - 📝 Track applications

#### Admin Login Flow
1. Click **"Admin Login"** button
2. You'll be redirected to the Admin Dashboard
3. Explore:
   - 📈 Analytics and metrics
   - ➕ Add new jobs
   - 🛠️ Manage existing jobs
   - 👥 View and manage applications

---

### 5️⃣ Testing the Features

#### As a Student:

**Step 1: Upload Resume**
1. Go to "Upload Resume" from sidebar
2. Drag and drop a file or click to browse
3. Wait for skill extraction (simulated)
4. Review and select your skills
5. Click "Save Skills & Update Profile"

**Step 2: Browse Jobs**
1. Go to "Browse Jobs" from sidebar
2. Use search bar to find specific jobs
3. Filter by job type or skills
4. Click "View Details" to see full description
5. Click "Apply Now" to apply

**Step 3: View Applications**
1. Go to "My Applications" from sidebar
2. See all applied jobs with status
3. Filter by status (Applied, Selected, Rejected)
4. Try the "Simulate status update" buttons

**Step 4: Explore Dashboard**
1. Go back to "Dashboard"
2. See your top recommended jobs
3. View match percentages
4. Check skill gaps for each job

#### As an Admin:

**Step 1: Add a New Job**
1. Go to "Add New Job" from sidebar
2. Fill in job details:
   - Title, Company, Location
   - Type, Duration, Stipend
   - Deadline
3. Select required skills
4. Add description and requirements
5. Click "Post Job"

**Step 2: Manage Jobs**
1. Go to "Manage Jobs" from sidebar
2. View all posted jobs in table format
3. Click 👁️ icon to view details
4. Click 🗑️ icon to delete a job
5. Confirm deletion

**Step 3: Manage Applications**
1. Go to "View Applications" from sidebar
2. See all student applications
3. Use the dropdown to update status
4. Filter applications by status
5. Search by job title or company

---

### 6️⃣ Additional Features

#### Dark Mode Toggle
- Click the 🌙 (moon) / ☀️ (sun) icon in the navbar
- Theme preference is saved automatically
- Works on all pages

#### Role Switching (Demo Feature)
- Click "Switch to Admin/Student" in navbar
- Test both student and admin features
- No login credentials required

#### Notifications
- Watch for toast notifications on:
  - Successful job application
  - Job creation/deletion
  - Skill updates
  - Status changes
- Auto-dismiss after 5 seconds

---

### 7️⃣ Understanding the Code

#### Key Files to Explore:

**Components** (`src/components/`)
- `JobCard.jsx` - Job display with match percentage
- `Navbar.jsx` - Top navigation bar
- `Sidebar.jsx` - Side menu
- `SkillTag.jsx` - Skill badges
- `ProgressBar.jsx` - Match percentage visualization

**Pages** (`src/pages/`)
- `Dashboard.jsx` - Student main page
- `Jobs.jsx` - Job listing with filters
- `Applications.jsx` - Application tracking
- `UploadResume.jsx` - Resume upload & skill extraction

**State Management** (`src/context/`)
- `AppContext.jsx` - Global state using Context API
  - Jobs data
  - Applications
  - Student profile
  - Notifications
  - Dark mode

**Data** (`src/data/`)
- `jobs.js` - 10 sample jobs
- `student.js` - Student profile and skills list

---

### 8️⃣ Making Changes

#### Add More Jobs
Edit `src/data/jobs.js` and add new job objects:
```javascript
{
  id: 11,
  title: "Your New Job",
  company: "Your Company",
  location: "Your Location",
  type: "Internship",
  duration: "3 months",
  stipend: "₹20,000/month",
  skills: ["Skill1", "Skill2"],
  description: "Your description",
  requirements: ["Req 1", "Req 2"],
  postedDate: "2024-03-25",
  deadline: "2024-04-30"
}
```

#### Modify Student Profile
Edit `src/data/student.js`:
```javascript
export const studentProfile = {
  name: "Your Name",
  email: "your.email@example.com",
  skills: ["JavaScript", "React", "Python"],
  // ... other fields
};
```

#### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-hex-color',
  }
}
```

---

### 9️⃣ Troubleshooting

#### Server won't start?
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

#### Port 3000 already in use?
Edit `vite.config.js`:
```javascript
server: {
  port: 3001, // Change to any available port
}
```

#### Dark mode not working?
```bash
# Clear browser localStorage
# Open DevTools (F12)
# Go to Application → Local Storage
# Delete all items
# Refresh page
```

#### Changes not reflecting?
```bash
# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

### 🔟 Building for Production

When ready to deploy:

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

The build will be in the `dist/` folder.

---

### 📚 Learn More

#### React Concepts Used:
- ✅ Functional Components
- ✅ Hooks (useState, useEffect, useContext)
- ✅ Context API for state management
- ✅ React Router for navigation
- ✅ Conditional rendering
- ✅ List rendering with map()
- ✅ Form handling
- ✅ Event handling

#### Tailwind CSS Features:
- ✅ Utility-first classes
- ✅ Responsive design (sm:, md:, lg:)
- ✅ Dark mode (dark:)
- ✅ Custom animations
- ✅ Gradient backgrounds
- ✅ Hover effects
- ✅ Flexbox and Grid

---

### ✅ Checklist for Academic Submission

Before submitting:
- [ ] Application runs without errors
- [ ] All features work as expected
- [ ] Dark mode toggles properly
- [ ] Navigation works on all pages
- [ ] Jobs can be added/deleted (admin)
- [ ] Applications can be tracked (student)
- [ ] Resume upload simulation works
- [ ] Match percentages display correctly
- [ ] Notifications appear for actions
- [ ] Code is clean and commented
- [ ] README.md is included
- [ ] Screenshots/demo video prepared (optional)

---

### 🎯 Demo Script for Presentation

**1. Introduction (30 sec)**
"This is JobConnect, a modern job recommendation system built with React and Tailwind CSS."

**2. Landing Page (30 sec)**
"The landing page features a clean design with hero section and feature highlights."

**3. Student Portal (2 min)**
- Login as student
- Show dashboard with recommendations
- Upload resume and extract skills
- Browse and apply to jobs
- Track applications

**4. Admin Portal (1.5 min)**
- Login as admin
- View analytics dashboard
- Add a new job
- Manage existing jobs
- Update application status

**5. Features Highlight (1 min)**
- Dark mode toggle
- Responsive design (resize browser)
- Smart matching algorithm
- Skill gap analysis
- Real-time notifications

---

### 💡 Tips for Best Experience

1. **Use Chrome/Firefox** for best compatibility
2. **Keep DevTools open** to see console logs (F12)
3. **Test both themes** (light and dark mode)
4. **Try all user flows** (student and admin)
5. **Add sample data** to see full functionality
6. **Take screenshots** for documentation
7. **Note the code structure** for explaining architecture

---

### 🆘 Need Help?

If you encounter issues:
1. ✅ Check this guide again
2. ✅ Read error messages in terminal/console
3. ✅ Review the README.md file
4. ✅ Check code comments
5. ✅ Verify Node.js version
6. ✅ Delete node_modules and reinstall

---

### 🎓 Project Understanding

**What makes this project special?**
- ✨ Modern UI/UX with professional design
- 🎯 Complete features (not just basic CRUD)
- 📱 Fully responsive across all devices
- 🌙 Dark mode implementation
- 🔔 Real-time notifications
- 📊 Data visualization (charts, progress bars)
- 🎨 Tailwind CSS for rapid styling
- ⚡ Fast performance with Vite
- 🏗️ Clean, maintainable code structure
- 📚 Well-documented and commented

**Perfect for:**
- Academic projects
- Portfolio showcase
- Learning React fundamentals
- Understanding modern web development
- Preparing for interviews

---

**You're all set! Enjoy exploring the application! 🚀**

If you have any questions, refer to the main README.md for detailed documentation.

Happy coding! 💻✨
