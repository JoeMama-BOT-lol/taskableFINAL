import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Sun, Moon, ZoomIn, List, Calendar } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useSettings } from '../hooks/useSettings';

const zoomLevels = [
  { value: 1, label: '100%' },
  { value: 1.25, label: '125%' },
  { value: 1.5, label: '150%' },
  { value: 2, label: '200%' },
];

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const {
    isDark,
    showNumbering,
    zoom,
    showDayOfWeek,
    showYear,
    setDark,
    setShowNumbering,
    setZoom,
    setShowDayOfWeek,
    setShowYear,
  } = useSettings();

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <SettingsIcon size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[240px] space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={() => setDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <Sun size={20} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Numbers</span>
            <button
              onClick={() => setShowNumbering(!showNumbering)}
              className={`p-2 rounded-full transition-colors ${
                showNumbering
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Day of Week</span>
            <button
              onClick={() => setShowDayOfWeek(!showDayOfWeek)}
              className={`p-2 rounded-full transition-colors ${
                showDayOfWeek
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Year</span>
            <button
              onClick={() => setShowYear(!showYear)}
              className={`p-2 rounded-full transition-colors ${
                showYear
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar size={20} />
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Zoom Level
            </label>
            <div className="relative">
              <select
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {zoomLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ZoomIn className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Account</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
