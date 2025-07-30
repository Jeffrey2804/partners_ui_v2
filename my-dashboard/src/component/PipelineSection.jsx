import { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineCard from './PipelineCard';

const PipelineSection = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [filterStage, setFilterStage] = useState('All');
  const [pipelineData, setPipelineData] = useState([]);
  const sectionRef = useRef(null);

  const fallbackData = [
    { stage: 'New Lead', color: 'teal', icon: '🟢', leadCount: 25, avgTime: '2:30', conversion: '12%', title: 'Lead A', desc: 'Initial contact made.' },
    { stage: 'Contacted', color: 'gray', icon: '📞', leadCount: 18, avgTime: '3:20', conversion: '10%', title: 'Lead B', desc: 'Waiting for follow-up.' },
    { stage: 'Application Started', color: 'blue', icon: '📝', leadCount: 12, avgTime: '1:45', conversion: '8%', title: 'Lead C', desc: 'Submitted partial form.' },
    { stage: 'Pre-Approved', color: 'red', icon: '✅', leadCount: 7, avgTime: '4:00', conversion: '5%', title: 'Lead D', desc: 'Pre-approval given.' },
    { stage: 'In Underwriting', color: 'orange', icon: '🔍', leadCount: 5, avgTime: '5:15', conversion: '3%', title: 'Lead E', desc: 'Review in progress.' },
    { stage: 'Closed', color: 'green', icon: '🏁', leadCount: 3, avgTime: '6:00', conversion: '2%', title: 'Lead F', desc: 'Deal closed successfully.' },
  ];

  useEffect(() => {
    fetch('/api/pipeline-data')
      .then((res) => res.json())
      .then((data) => setPipelineData(data))
      .catch(() => setPipelineData(fallbackData));
  }, []);

  const filteredData =
    filterStage === 'All'
      ? pipelineData
      : pipelineData.filter((item) => item.stage === filterStage);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 sm:px-6 py-8 text-gray-800 dark:text-white"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">🧭 Pipeline Overview</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
          'All',
          'New Lead',
          'Contacted',
          'Application Started',
          'Pre-Approved',
          'In Underwriting',
          'Closed',
        ].map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
              filterStage === stage
                ? 'bg-[#01818E] text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex flex-wrap gap-11 pl-4">
          {filteredData.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="min-w-[240px] max-w-[240px] flex-shrink-0"
              onClick={() => setActiveCard(item)}
            >
              <PipelineCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 dark:bg-black/60"
            onClick={() => setActiveCard(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-lg sm:max-w-xl md:max-w-2xl p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-teal-500"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-xl"
              >
                ×
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                {activeCard.stage} Details
              </h2>
              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <strong>Leads:</strong> {activeCard.leadCount}
                </p>
                <p>
                  <strong>Avg Time:</strong> {activeCard.avgTime}
                </p>
                <p>
                  <strong>Conversion:</strong> {activeCard.conversion}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{activeCard.desc}</p>
              </div>

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: 'Week 1', value: 20 },
                      { name: 'Week 2', value: 35 },
                    ]}
                  >
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkTheme() ? '#1f2937' : '#ffffff',
                        color: isDarkTheme() ? '#e5e7eb' : '#0f172a',
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const isDarkTheme = () =>
  typeof window !== 'undefined' &&
  document.documentElement.classList.contains('dark');

export default PipelineSection;
