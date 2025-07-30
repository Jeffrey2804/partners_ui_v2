import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

const sampleData = [
  { name: 'Item 1', value: 8 },
  { name: 'Item 2', value: 12 },
  { name: 'Item 3', value: 16 },
  { name: 'Item 4', value: 20 },
];

const colors = ['#0E7886', '#3DC1D3', '#FDB92A', '#837A75'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 shadow-md text-sm text-gray-800 dark:text-white">
        <div className="font-semibold">{label}</div>
        <div>CTR: {payload[0].value}%</div>
      </div>
    );
  }
  return null;
};

const CTRAnalyticsChart = () => {
  const [selectedFilter, setSelectedFilter] = useState('CTR by Product Partner');

  return (
    <section className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl shadow-md p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">📈 CTR Analytics</h2>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none"
        >
          <option>CTR by Product Partner</option>
          <option>CTR by Campaign</option>
          <option>CTR by Channel</option>
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sampleData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#8884d830" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 25]}
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            formatter={(value, entry, index) => (
              <span className="text-sm font-medium" style={{ color: colors[index] }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {sampleData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CTRAnalyticsChart;
