import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MoonStar,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  SunMedium,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Store', path: '/store', icon: <ShoppingBag className="h-4 w-4" /> },
    { label: 'Guide', path: '/guide', icon: <PlayCircle className="h-4 w-4" /> },
    { label: 'Contact', path: '/contact', icon: <Mail className="h-4 w-4" /> },
  ];
  const themeLabel = isDark ? 'Switch to light' : 'Switch to dark';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-2 text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)] dark:bg-sky-500 dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Student Hub</p>
              <p className="text-lg font-black text-slate-950 dark:text-white">Pakistan</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-[0_10px_20px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 md:flex">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive(link.path)
                    ? 'bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={isDark ? 'Current theme is dark mode. Click to switch to light mode.' : 'Current theme is light mode. Click to switch to dark mode.'}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            {themeLabel}
          </button>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white dark:bg-sky-500 dark:text-slate-950">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">{user.name?.split(' ')[0]}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{user.role}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition dark:text-slate-500 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute right-0 mt-3 w-64 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="rounded-[1.25rem] bg-slate-50 px-4 py-4 dark:bg-slate-900">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Signed in as</p>
                        <p className="mt-2 font-bold text-slate-950 dark:text-white">{user.email}</p>
                      </div>

                      <div className="mt-3 grid gap-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="inline-flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="inline-flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <UserRound className="h-4 w-4" />
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="inline-flex items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <span>{themeLabel}</span>
                {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>

              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
                    isActive(link.path)
                      ? 'bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950'
                      : 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-left text-sm font-bold text-rose-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[1.25rem] bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white dark:bg-sky-500 dark:text-slate-950"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
