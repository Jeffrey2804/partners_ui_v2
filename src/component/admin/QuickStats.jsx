import React, { useState } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { BsSpeedometer2 } from 'react-icons/bs';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import StatModal from './StatModal';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const chartData = [
  [{ value: 68 }, { value: 72 }, { value: 75 }, { value: 78 }, { value: 82 }],
  [{ value: 5 }, { value: 8 }, { value: 6 }, { value: 4 }, { value: 7 }],
  [{ value: 12 }, { value: 10 }, { value: 8 }, { value: 9 }, { value: 7 }],
];

const QuickStats = () => {
  const [selectedStat, setSelectedStat] = useState(null);

  const stats = [
    {
      title: '% of loans on schedule',
      icon: <BsSpeedometer2 className="text-xl" />,
      value: <CountUp end={82} duration={2} suffix="%" />,
      valueText: '82%',
      trend: 'up',
      badge: 'Up 6% this week',
      chart: chartData[0],
      color: 'blue',
    },
    {
      title: 'Top overdue files',
      icon: <FaExclamationTriangle className="text-xl" />,
      value: '—',
      valueText: '—',
      trend: 'down',
      badge: 'Down from last week',
      chart: chartData[1],
      color: 'amber',
    },
    {
      title: 'Avg days in processing',
      icon: <FiClock className="text-xl" />,
      value: '—',
      valueText: '—',
      trend: 'up',
      badge: 'Up by 2 days',
      chart: chartData[2],
      color: 'green',
    },
  ];

  return (
    <section className="space-y-6 bg-white p-4 rounded-xl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-zinc-800"
      >
        📈 Quick Stats
      </motion.h2>

      <div className="flex flex-col gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedStat(stat)}
            className={`transition-all cursor-pointer p-6 rounded-xl shadow-lg min-h-[160px] flex flex-col justify-between backdrop-blur-md hover:shadow-xl bg-white text-${stat.color}-900`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {stat.icon}
                <h3 className="text-md font-semibold text-zinc-800">
                  {stat.title}
                </h3>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up'
                    ? 'bg-green-500/20 text-green-700'
                    : 'bg-red-500/20 text-red-700'
                }`}
              >
                {stat.badge}
              </span>
            </div>

            <p
              className={`text-4xl font-bold mt-1 ${
                stat.value === '—' ? 'text-black/60 text-lg' : ''
              }`}
            >
              {stat.value}
            </p>

            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.chart}>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      <StatModal
        open={!!selectedStat}
        onClose={() => setSelectedStat(null)}
        stat={selectedStat}
      />
    </section>
  );
};

export default QuickStats;
