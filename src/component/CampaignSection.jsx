import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';

const CampaignSection = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const lineData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 60 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 90 },
    { name: 'Jun', value: 110 },
  ];

  const pieData = [
    { name: 'Facebook ads', value: 158, color: '#f87171' },
    { name: 'Health and Careness', value: 222, color: '#a78bfa' },
    { name: 'Lorem ipsum', value: 291, color: '#60a5fa' },
    { name: 'Others', value: 330, color: '#facc15' },
  ];

  const totalLeads = pieData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => setActivePoint(null), 3000);
    return () => clearTimeout(timer);
  }, [activePoint]);

  const axisColor = '#64748b';
  const tooltipBg = '#ffffff';
  const tooltipText = '#0f172a';

  return (
    <section className="flex flex-col xl:flex-row gap-10 animate-fade-in">
      {/* LINE CHART */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
            📊 Top Performing Campaigns
          </h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => window.open('/api/export-campaigns/csv', '_blank')}
              className="text-xs sm:text-sm text-white bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600 transition">
              Export CSV
            </button>
            <button onClick={() => window.open('/api/export-campaigns/pdf', '_blank')}
              className="text-xs sm:text-sm text-white bg-pink-500 px-4 py-2 rounded hover:bg-pink-600 transition">
              Export PDF
            </button>
            <button className="text-xs sm:text-sm text-white bg-gradient-to-r from-teal-500 to-teal-700 px-5 py-2 rounded-full shadow hover:scale-105 transition-all">
              Filter ⚙️
            </button>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              onMouseMove={(e) => setActivePoint(e?.activePayload?.[0]?.payload?.name)}>
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={{ background: tooltipBg, color: tooltipText, borderRadius: '8px' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={({ cx, cy }) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="white"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                  />
                )}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {activePoint && (
          <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
            Hovering: {activePoint}
          </div>
        )}
      </div>

      {/* DONUT CHART */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight flex items-center gap-2">
          📈 Lead Source Breakdown
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative w-full max-w-[300px] h-[300px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient id={`grad-${index}`} key={`grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  onMouseEnter={(_, i) => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#grad-${index})`}
                      stroke="#fff"
                      strokeWidth={hoveredIndex === index ? 3 : 2}
                      style={{
                        transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                        filter: hoveredIndex === index ? 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'none',
                        transformOrigin: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Pie>

                {/* Center Labels */}
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl font-bold fill-slate-800 dark:fill-slate-100"
                >
                  {totalLeads}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-slate-500 dark:fill-slate-400"
                >
                  Total Leads
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
            {pieData.map((entry, index) => (
              <li key={`legend-${index}`} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full inline-block shadow-sm"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${entry.color}, ${entry.color}99)`
                  }}
                ></span>
                <span className="font-medium">{entry.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-right">
          Last updated: just now
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
