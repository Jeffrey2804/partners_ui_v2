import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PauseCircle, Clock, ArrowUpDown, Info } from 'lucide-react';
import { Tooltip } from '@radix-ui/react-tooltip';

const leadsData = [
  {
    partner: 'ABC Title Co.',
    leads: 67,
    mqls: 41,
    cpl: '$12.50',
    source: 'Co-branded email',
    status: 'Active',
    url: '#',
  },
  {
    partner: 'HomeShield Warranty',
    leads: 82,
    mqls: 52,
    cpl: '$9.10',
    source: 'Paid Meta Ads',
    status: 'Pending',
    url: '#',
  },
  {
    partner: 'RateCompare Pro',
    leads: 138,
    mqls: 37,
    cpl: '$15.70',
    source: 'GMB/Web',
    status: 'Paused',
    url: '#',
  },
];

const statusIcon = {
  Active: <CheckCircle size={16} className="text-green-500" />,
  Pending: <Clock size={16} className="text-yellow-500" />,
  Paused: <PauseCircle size={16} className="text-red-500" />,
};

const getStatusBadge = (status) => {
  const base = 'inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full';
  switch (status) {
    case 'Active':
      return `${base} text-green-500 bg-green-100 dark:bg-green-800/20`;
    case 'Pending':
      return `${base} text-yellow-500 bg-yellow-100 dark:bg-yellow-700/20`;
    case 'Paused':
      return `${base} text-red-500 bg-red-100 dark:bg-red-800/20`;
    default:
      return `${base} text-gray-500 bg-gray-100 dark:bg-gray-700/20`;
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const PartnerLeadsTable = () => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);

  const sortedData = [...leadsData]
    .filter((d) => d.partner.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0;
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Mini KPI Widgets */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#01818E] to-cyan-500 text-white shadow-md">🔥 Top Partner: RateCompare Pro</div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#01818E] to-cyan-500 text-white shadow-md">💰 Avg CPL: $12.43</div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#01818E] to-cyan-500 text-white shadow-md">📈 Total MQLs: 130</div>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search partners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded-md w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md bg-white/10 dark:bg-zinc-900/30">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wide sticky top-0 backdrop-blur-md z-10">
            <tr>
              {['partner', 'leads', 'mqls', 'cpl', 'source', 'status'].map((key) => (
                <th
                  key={key}
                  onClick={() => setSortKey(key)}
                  className="px-4 py-3 cursor-pointer hover:text-blue-500 whitespace-nowrap"
                >
                  <div className="inline-flex items-center gap-1">
                    {key.toUpperCase()} <ArrowUpDown size={12} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {sortedData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                  variants={rowVariants}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <td className="px-4 py-3">
                    <a href={row.url} className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300">
                      {row.partner}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.leads}</td>
                  <td className="px-4 py-3 font-medium">{row.mqls}</td>
                  <td className="px-4 py-3">{row.cpl}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(row.status)}>
                      {statusIcon[row.status]} {row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 text-2xl shadow-lg transition-all">
        +
      </button>
    </div>
  );
};

export default PartnerLeadsTable;