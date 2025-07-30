import React, { useMemo, useState, useEffect } from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';
import { motion } from 'framer-motion';

const rawData = [
  { id: 'Clicks', value: 100 },
  { id: 'Landing Page Views', value: 85 },
  { id: 'Form Submissions', value: 47 },
  { id: 'Qualified Leads', value: 25 },
  { id: 'Booked Appointments', value: 15 },
  { id: 'Closed/Won Deals', value: 8 },
];

const FunnelSkeleton = () => (
  <div className="relative h-[500px] w-full rounded-lg overflow-hidden bg-gradient-to-br from-zinc-200/70 to-zinc-300/50 animate-pulse">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
  </div>
);

const LeadConversionFunnel = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(() => {
    return rawData.map((step) => ({
      ...step,
      percentage: ((step.value / rawData[0].value) * 100).toFixed(0),
    }));
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-all">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-semibold text-gray-800 dark:text-white mb-6"
      >
        🚀 Lead Conversion Funnel
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
          className="min-w-[640px] h-[500px]"
        >
          {isLoading ? (
            <FunnelSkeleton />
          ) : (
            <ResponsiveFunnel
              data={data}
              margin={{ top: 30, right: 100, bottom: 30, left: 100 }}
              spacing={10}
              shapeBlending={0.7}
              direction="vertical"
              valueFormat={(v) => `${v}%`}
              labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
              labelPosition="inside"
              labelOffset={-8}
              borderWidth={1}
              borderColor="#016D78"
              motionConfig="wobbly"
              defs={[
                {
                  id: 'tealGradient',
                  type: 'linearGradient',
                  colors: [
                    { offset: 0, color: '#66D2D6' },
                    { offset: 100, color: '#01818E' },
                  ],
                },
              ]}
              fill={[
                {
                  match: '*',
                  id: 'tealGradient',
                },
              ]}
              theme={{
                labels: {
                  text: {
                    fontSize: 13,
                    fontWeight: 600,
                    fill: '#111111',  // static text color
                  },
                },
              }}
              tooltip={({ part }) => (
                <div className="bg-white text-gray-800 text-sm rounded-md px-4 py-2 shadow-md border border-gray-200">
                  <strong>{part.data.id}</strong>
                  <div>{part.data.value} leads</div>
                  <div>{part.data.percentage}%</div>
                </div>
              )}
            />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LeadConversionFunnel;
