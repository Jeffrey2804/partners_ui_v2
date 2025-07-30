import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartPie } from 'react-icons/fa';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const rawMetrics = [
  { label: 'Total Clicks', value: '3,457', data: [3200, 3400, 3500, 3457] },
  { label: 'CTR (Click-Through Rate)', value: '4.8%', data: [3.2, 4.1, 4.3, 4.8] },
  { label: 'Leads Generated', value: '287', data: [240, 260, 275, 287] },
  { label: 'Qualified Leads (MQLs)', value: '134', data: [100, 110, 123, 134] },
  { label: 'Conversion Rate', value: '13.2%', data: [10, 11.5, 12.8, 13.2] },
  { label: 'Appointments Booked', value: '68', data: [50, 58, 63, 68] },
  { label: 'Top Performing Partner', value: 'XYZ Home Warranty' },
];

const PartnerOverviewTable = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (metric) => {
    if (metric.data) {
      setSelectedMetric(metric);
    }
  };

  const closeModal = () => setSelectedMetric(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-full shadow-inner ring-2"
            style={{
              backgroundColor: '#01818E1A',
              borderColor: '#01818E40',
              ringColor: '#01818E80',
            }}
          >
            <FaChartPie className="text-[#01818E] dark:text-[#33B6BE] text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Partner Insights
          </h2>
        </div>
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 transition" style={{ focusRingColor: '#01818E' }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
          <select className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 transition" style={{ focusRingColor: '#01818E' }}>
            <option>Email</option>
            <option>Social</option>
            <option>Referral</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead style={{ backgroundColor: '#01818E0D' }} className="dark:bg-[#01818E1A] text-gray-800 dark:text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-2">Metric</th>
              <th className="px-4 py-2">Trend</th>
              <th className="px-4 py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-200">
            {loading
              ? Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i} className="bg-white dark:bg-gray-800 rounded-md animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              : rawMetrics.map((metric, i) => {
                  const isTop = metric.label === 'Top Performing Partner';
                  return (
                    <motion.tr
                      key={metric.label}
                      whileHover={{ scale: 1.01 }}
                      className={`cursor-pointer transition-all duration-300 rounded-md shadow-sm ${
                        isTop
                          ? 'bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 dark:border-blue-400'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                      onClick={() => openModal(metric)}
                    >
                      <td className="px-4 py-3 font-medium">{metric.label}</td>
                      <td className="px-4 py-3">
                        {!isTop && metric.data && (
                          <ResponsiveContainer width={80} height={30}>
                            <LineChart
                              data={metric.data.map((v, i) => ({ value: v, name: `Day ${i + 1}` }))}
                            >
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#111827',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                }}
                                labelStyle={{ color: 'gray' }}
                                cursor={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#01818E"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isTop ? (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {metric.value}
                          </span>
                        ) : (
                          metric.value
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-xl mx-auto relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {selectedMetric.label} – Full Chart
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart
                  data={selectedMetric.data.map((v, i) => ({ value: v, name: `Day ${i + 1}` }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#01818E"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default PartnerOverviewTable;
