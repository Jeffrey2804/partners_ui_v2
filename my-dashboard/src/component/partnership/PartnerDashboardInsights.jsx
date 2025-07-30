import React from 'react';
import { motion } from 'framer-motion';
import CampaignTrackerTable from './CampaignTrackerTable';
import PartnerRecommendations from './PartnerRecommendations';
import IntegrationSummary from './IntegrationSummary';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const PartnerDashboardInsights = () => {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-10 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Left Section */}
      <motion.div className="lg:col-span-2 space-y-8" variants={fadeIn}>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">📊 Campaign Performance</h2>
        </div>

        <CampaignTrackerTable />

        <motion.div variants={fadeIn}>
          <PartnerRecommendations />
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div variants={fadeIn}>
        <IntegrationSummary />
      </motion.div>
    </motion.div>
  );
};

export default PartnerDashboardInsights;
