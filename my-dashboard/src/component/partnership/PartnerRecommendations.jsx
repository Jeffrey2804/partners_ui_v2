import React from 'react';
import { motion } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import { Info } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const PRIMARY = '#01818E';

const tasks = [
  {
    icon: '⚠️',
    text: 'Underperforming partner flagged (CTR < 2%)',
    bg: `${PRIMARY}1A`,
    popover: {
      title: 'Why flagged?',
      description:
        'This partner has a click-through rate below 2% over the last 14 days. Review creatives or pause underperforming sources.',
    },
  },
  {
    icon: '🔍',
    text: 'Campaigns with low conversion needing review',
    bg: `${PRIMARY}1A`,
    popover: {
      title: 'Low Conversion Insight',
      description:
        'Review your call-to-action, lead forms, and offer relevance. Conversion rates have dropped below target.',
    },
  },
  {
    icon: '🧪',
    text: 'Suggested tests (CTA, landing page, offer)',
    bg: `${PRIMARY}1A`,
    popover: {
      title: 'Experiment Ideas',
      description:
        'Try A/B testing your call-to-action buttons, adjust landing copy, or experiment with limited-time bonuses.',
    },
  },
];

const PartnerRecommendations = () => {
  return (
    <motion.section
      className="w-full bg-transparent text-zinc-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-bold flex items-center gap-2"
        >
          🛠️ Actionable Tasks & Recommendations
        </motion.h2>
      </div>

      <div className="space-y-4">
        {tasks.map((task, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            style={{ backgroundColor: task.bg }}
            className="px-5 py-3 rounded-lg flex justify-between items-center shadow hover:shadow-lg transition duration-300 transform hover:scale-[1.015]"
          >
            <span className="flex items-center gap-2">{task.icon} {task.text}</span>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="text-xl text-gray-800 hover:text-black transition-transform hover:scale-125">
                  <Info size={18} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="top"
                  align="end"
                  className="p-3 w-64 rounded-md bg-white shadow-xl border border-zinc-300 text-sm text-zinc-800 z-50"
                  sideOffset={5}
                >
                  <p className="mb-1 font-semibold">{task.popover.title}</p>
                  <p className="text-xs">{task.popover.description}</p>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </motion.div>
        ))}

        {/* High Performers Checklist */}
        <motion.div
          variants={fadeInUp}
          style={{ backgroundColor: `${PRIMARY}1A` }}
          className="px-5 py-4 rounded-lg shadow hover:shadow-lg transition text-gray-900"
        >
          <p className="font-semibold mb-2 flex justify-between items-center text-base">
            🌟 High-performing partners for scaling
            <span className="text-sm">▼</span>
          </p>
          <ul className="list-disc list-inside text-sm" style={{ color: PRIMARY }}>
            {[1, 2, 3].map((_, i) => (
              <li key={i}>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    style={{ accentColor: PRIMARY }}
                    defaultChecked={i < 2}
                  />
                  <span
                    className="underline group-hover:opacity-90 transition-opacity"
                    style={{ color: PRIMARY }}
                  >
                    Lorem ipsum dolor sit amet
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PartnerRecommendations;
