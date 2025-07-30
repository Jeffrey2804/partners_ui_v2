
import { motion } from 'framer-motion';

const TaskCard = ({ title }) => {
  // Check if dark mode is enabled
  const darkMode = document.documentElement.classList.contains('dark');

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(1,129,142,0.25)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`min-w-[260px] max-w-[280px] p-5 rounded-2xl shadow-md border flex flex-col gap-4 text-sm transition-all ${
        darkMode
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* Title */}
      <h3 className="text-base font-bold text-[#01818E] truncate">
        📌 {title}
      </h3>

      {/* Meta Info */}
      <div className={`space-y-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>🔖 LOA</p>
        <p>
          📅 Due:{' '}
          <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
            June 30, 2025
          </span>
        </p>
      </div>

      {/* Status Chips */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-xs rounded-full bg-[#01818E]/20 text-[#01818E] font-semibold">
          ✅ On Track
        </span>
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold dark:bg-yellow-600 dark:text-white">
          ⏳ Pending
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Notes
        </button>
        <button
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📎 Attachments
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
