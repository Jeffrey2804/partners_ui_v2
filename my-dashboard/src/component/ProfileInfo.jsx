// src/component/ProfileInfo.jsx
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // ✅ improved usage

const ProfileInfo = () => {
  const { user, logout } = useUser();                      // 🎯 full context access
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);                            // 🪄 click-outside tracker

  // ⛔ fallback if user not logged in
  if (!user) return null;

  /* ─── Close dropdown on outside click ───────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-4" ref={menuRef}>
      {/* 👤 Name and Tier */}
      <div
        className="text-right leading-tight cursor-pointer select-none"
        onClick={() => setOpen(!open)}
        role="button"
        aria-expanded={open}
      >
        <span className="block text-lg sm:text-xl md:text-2xl font-bold text-white">
          {user.name}
        </span>
        <span className="inline-block text-sm sm:text-base text-teal-100 font-light">
          {user.tier || 'Member'} ⌄
        </span>
      </div>

      {/* 📷 Avatar */}
      <img
        src={user.avatar}
        alt={`${user.name} avatar`}
        className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border-2 border-white shadow-md hover:scale-105 transition"
        onClick={() => setOpen(!open)}
      />

      {/* 📋 Dropdown */}
      {open && (
        <ul
          className="absolute top-full right-0 mt-3 w-52 bg-white dark:bg-gray-800
                     text-gray-800 dark:text-gray-100 rounded-xl shadow-xl z-50
                     text-sm overflow-hidden animate-fade-in"
        >
          <li className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            👤 View Profile
          </li>
          <li className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            ⚙️ Settings
          </li>
          <li
            className="px-4 py-3 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-300 cursor-pointer"
            onClick={logout}
          >
            🚪 Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileInfo;
