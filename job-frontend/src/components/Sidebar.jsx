import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiFileText, 
  FiUpload,
  FiUser
} from 'react-icons/fi';

const Sidebar = () => {
  const links = [
    { to: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/student/jobs', icon: FiBriefcase, label: 'Browse Jobs' },
    { to: '/student/applications', icon: FiFileText, label: 'My Applications' },
    { to: '/student/upload-resume', icon: FiUpload, label: 'Upload Resume' },
    { to: '/student/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 ${isActive ? 'animate-scale-in' : ''}`} />
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
