import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

// Tiny chart per row
const TinyChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={40}>
    <BarChart data={data}>
      <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
      <XAxis dataKey="label" hide />
      <Tooltip />
    </BarChart>
  </ResponsiveContainer>
);

const CampaignTrackerTable = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [sortKey, setSortKey] = useState('conversion');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaigns([
        {
          name: 'ABC Title Co.',
          partner: 67,
          variant: 41,
          ctr: '6.1',
          leads: 53,
          conversion: '14.7',
          performance: 'high',
          chart: [{ label: 'A', value: 10 }, { label: 'B', value: 25 }]
        },
        {
          name: 'HomeShield Warranty',
          partner: 82,
          variant: 52,
          ctr: '3.3',
          leads: 21,
          conversion: '9.4',
          performance: 'medium',
          chart: [{ label: 'A', value: 5 }, { label: 'B', value: 15 }]
        }
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (key) => {
    setSortKey(key);
    setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getTag = (perf) => {
    const tagStyles = {
      high: 'bg-green-100 text-green-700 ring-green-300',
      medium: 'bg-yellow-100 text-yellow-700 ring-yellow-300',
      low: 'bg-red-100 text-red-700 ring-red-300',
    };
    return tagStyles[perf];
  };

  const sorted = [...campaigns].sort((a, b) => {
    const aVal = parseFloat(a[sortKey]);
    const bVal = parseFloat(b[sortKey]);
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4"
    >
      <div className="overflow-x-auto rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
        <table className="min-w-full text-sm text-left text-slate-800">
          <thead className="bg-teal-700 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-6">📣 Campaign</th>
              <th className="py-3 px-6">🤝 Partner</th>
              <th className="py-3 px-6">🧪 Variant</th>
              <th className="py-3 px-6 cursor-pointer" onClick={() => handleSort('ctr')}>📊 CTR</th>
              <th className="py-3 px-6 cursor-pointer" onClick={() => handleSort('leads')}>📥 Leads</th>
              <th className="py-3 px-6 cursor-pointer" onClick={() => handleSort('conversion')}>🎯 Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [...Array(2)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {Array(6).fill(0).map((__, i) => (
                    <td key={i} className="py-3 px-6">
                      <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <AnimatePresence>
                {sorted.map((c, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-100 transition-all"
                  >
                    <td className="py-3 px-6 text-blue-600 underline cursor-pointer">{c.name}</td>
                    <td className="py-3 px-6">{c.partner}</td>
                    <td className="py-3 px-6">{c.variant}</td>
                    <td className="py-3 px-6">{c.ctr}%</td>
                    <td className="py-3 px-6">{c.leads}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ring-1 ${getTag(c.performance)}`}>
                        {c.conversion}%
                      </span>
                      <TinyChart data={c.chart} />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default CampaignTrackerTable;
