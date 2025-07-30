import { motion } from 'framer-motion';
import MetricCard from './MetricCard';

const metrics = [
  {
    title: 'Email Open Rate',
    value: '58%',
    trend: '+18%',
    delta: '+3.8k this week',
    bg: 'mint',
    data: [{ value: 35 }, { value: 48 }, { value: 44 }, { value: 58 }, { value: 60 }, { value: 65 }, { value: 58 }],
  },
  {
    title: 'Click-Through Rate',
    value: '24%',
    trend: '+12%',
    delta: '+1.2k this week',
    bg: 'lemon',
    data: [{ value: 18 }, { value: 20 }, { value: 22 }, { value: 26 }, { value: 28 }, { value: 24 }, { value: 27 }],
  },
  {
    title: 'Contact Growth Tracker',
    value: '1.5k',
    trend: '+9%',
    delta: '+140 this week',
    bg: 'sky',
    data: [{ value: 900 }, { value: 1000 }, { value: 1200 }, { value: 1300 }, { value: 1350 }, { value: 1400 }, { value: 1500 }],
  },
];

const MarketingSection = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-1">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl relative">
        
        {/* Animated Gradient Background (Teal-themed) */}
        <div
          className="absolute inset-0 z-0 animate-gradient-x bg-[length:300%_300%]
          bg-gradient-to-r from-[#007B84] via-[#01818E] to-[#00A7B5]
          dark:from-[#01474D] dark:via-[#01818E] dark:to-[#016F78]"
        />

        {/* Foreground Content */}
        <div className="relative z-10 px-6 sm:px-8 py-10 text-white dark:text-white">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Metric Cards */}
            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {metrics.map((m, i) => (
                <MetricCard key={i} {...m} />
              ))}
            </div>

            {/* Purpose Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              className="col-span-1 relative text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-md border border-white/20 transition-all"
            >
              {/* Icon Glow */}
              <div className="mb-4 mx-auto w-12 h-12 rounded-full flex items-center justify-center 
                bg-white/20 text-white shadow-inner ring-2 ring-white/30">
                🎯
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                Marketing Purpose
              </h3>

              <p className="mb-4 text-white/90 text-sm sm:text-base leading-relaxed">
                The goal is to build a <strong className="text-white">WORKDESK</strong> — a clean, intentional space where tasks and campaigns feel like progress, not clutter.
              </p>

              <p className="text-white/70 text-sm leading-relaxed">
                Every metric should be <span className="font-semibold text-white">actionable</span>.
                This is your command center — not a report. Use the numbers to guide your next move with clarity and confidence.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
