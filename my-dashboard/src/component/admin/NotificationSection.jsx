import React, { useState } from 'react';
import { FaClock, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_NOTIFICATIONS = [
  {
    type: 'reminder',
    color: 'green',
    label: 'REMINDER',
    title: 'Meeting with project stakeholders',
    subtitle: 'Don’t forget the Zoom call at 8am',
    time: '2025-07-29T08:00:00',
  },
  {
    type: 'info',
    color: 'green',
    label: 'INFO',
    title: 'Weekly report available',
    subtitle: 'Download the summary report from dashboard',
    time: '2025-07-28T13:15:00',
  },
  {
    type: 'warning',
    color: 'yellow',
    label: 'WARNING',
    title: 'Storage almost full',
    subtitle: 'You have used 90% of your allocated space',
    time: '2025-07-28T13:45:00',
  },
];

const typeToIcon = {
  reminder: <FaClock className="text-green-500" />,
  warning: <FaExclamationTriangle className="text-yellow-500" />,
  info: <FaInfoCircle className="text-blue-500" />,
};

const tabs = ['All', 'Reminders', 'Warnings', 'Info'];

const NotificationSection = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const dismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Reminders') return n.type === 'reminder';
    if (filter === 'Warnings') return n.type === 'warning';
    if (filter === 'Info') return n.type === 'info';
    return true;
  });

  return (
    <section className="pt-10 border-t border-gray-200 dark:border-gray-700">
      <motion.h2
        className="text-2xl font-bold mb-6 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
          alt="bell"
          className="w-6 h-6"
        />
        Notifications
      </motion.h2>

      <div className="flex gap-3 mb-4 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-full border transition ${
              filter === tab
                ? 'bg-blue-600 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.map((n, i) => (
            <motion.li
              key={n.time + i}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex gap-4 rounded-lg p-4 overflow-hidden shadow-md border-l-4 ${
                n.color === 'green'
                  ? 'border-green-500'
                  : n.color === 'yellow'
                  ? 'border-yellow-500'
                  : 'border-red-500'
              } bg-white/70 backdrop-blur-md`}
            >
              <div className="text-xl">{typeToIcon[n.type]}</div>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-0.5 rounded-full text-white ${
                      n.color === 'green'
                        ? 'bg-green-600'
                        : n.color === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {n.label}
                  </span>
                  <button onClick={() => dismiss(i)} className="text-sm text-gray-400 hover:text-red-500">
                    <FaTimes />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                <p className="text-xs text-gray-600">{n.subtitle}</p>
                <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
                  <FaClock />
                  <span>{formatDistanceToNow(new Date(n.time), { addSuffix: true })}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            No notifications to show.
          </motion.div>
        )}
      </ul>
    </section>
  );
};

export default NotificationSection;
