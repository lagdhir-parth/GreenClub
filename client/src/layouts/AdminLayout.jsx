import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiHeart, FiTrendingUp, FiSettings,
  FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiArrowLeft, FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const adminNavItems = [
  { path: '/admin', icon: FiTrendingUp, label: 'Analytics' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/charities', icon: FiHeart, label: 'Charities' },
  { path: '/admin/draws', icon: FiSettings, label: 'Draw Management' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-bg-secondary text-text-primary">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-bg-primary border-r border-border
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 px-8 h-20 shrink-0 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-text-primary">
            Admin Panel
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-text-secondary transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="flex flex-col gap-1.5">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400'
                      : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-text-primary'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-text-primary"
            >
              <FiArrowLeft className="w-5 h-5" />
              Return to App
            </NavLink>
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="p-6 shrink-0 border-t border-border bg-bg-primary">
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-surface-100 dark:hover:bg-surface-800 border border-border text-text-secondary hover:text-text-primary cursor-pointer shadow-sm"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-danger-50 hover:border-danger-200 dark:hover:bg-danger-500/10 border border-border text-text-secondary hover:text-danger-500 cursor-pointer shadow-sm"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <header
          className="h-20 flex items-center gap-4 px-6 lg:px-10 shrink-0 sticky top-0 z-30 backdrop-blur-2xl bg-bg-glass-strong border-b border-border shadow-sm/50"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 text-text-secondary hover:text-text-primary cursor-pointer shadow-sm border border-border/50"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h2 className="text-sm font-bold text-text-secondary tracking-widest uppercase hidden sm:block">
            GreenClub Administration
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col w-full page-container max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
