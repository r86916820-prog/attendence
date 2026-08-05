import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, User, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { FacultyUser } from '../types';

interface NavbarProps {
  faculty: FacultyUser;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  faculty,
  darkMode,
  onToggleDarkMode,
  onNavigate,
  onLogout,
  onToggleSidebar,
  globalSearch,
  onGlobalSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Section: Sidebar Toggle & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Everywhere Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Search students, subjects, roll numbers, departments..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</h4>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">3 New</span>
                </div>
                <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
                  <div className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Attendance Logged</p>
                      <p className="text-slate-500 dark:text-slate-400">CSE Sem 7 Sec A attendance saved successfully.</p>
                      <span className="text-[10px] text-slate-400">10 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Low Attendance Alert</p>
                      <p className="text-slate-500 dark:text-slate-400">3 students fall below 75% threshold in Compiler Design.</p>
                      <span className="text-[10px] text-slate-400">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <img
                src={faculty.photo}
                alt={faculty.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">{faculty.fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{faculty.designation}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-2">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{faculty.fullName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{faculty.email}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Faculty Profile & Settings</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
