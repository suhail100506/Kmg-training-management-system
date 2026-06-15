import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Sun, Moon, LogOut, ChevronRight, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Create simple breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Dashboard', path: '/dashboard' }];
    
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const label = path
        .replace(/-/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
      return { label, path: url };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-200">
      {/* Left section: Drawer Toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-500 dark:text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link to="/dashboard" className="hover:text-brand-700 dark:hover:text-brand-400">Home</Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link 
                to={crumb.path} 
                className={`hover:text-brand-700 dark:hover:text-brand-400 ${
                  idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-semibold' : ''
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right section: Dark Mode toggle & User actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 transition-all duration-200"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Avatar Dropdown placeholder / label */}
        <div className="flex items-center space-x-2.5">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            <span className="text-[9px] text-slate-400 capitalize">{user?.role.replace('_', ' ')}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/40">
            <User className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
