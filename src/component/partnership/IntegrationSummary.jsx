import React from 'react';
import { FaLink, FaPlug } from 'react-icons/fa';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

const IntegrationSummary = () => {
  const integrationGroups = [
    {
      title: 'CRM LEAD SYNCS',
      integrations: [
        ['GHL', 'WARNING', 'yellow'],
        ['HubSpot', 'DISCONNECTED', 'red'],
        ['Salesforce', 'SYNCED', 'green']
      ]
    },
    {
      title: 'EMAIL PLATFORMS',
      integrations: [
        ['Mailchimp', 'WARNING', 'yellow'],
        ['ActiveCampaign', 'DISCONNECTED', 'red']
      ]
    },
    {
      title: 'AD PLATFORMS',
      integrations: [
        ['Meta', 'WARNING', 'yellow'],
        ['Google', 'DISCONNECTED', 'red'],
        ['LinkedIn', 'SYNCED', 'green']
      ]
    }
  ];

  const statusConfig = {
    SYNCED: {
      tooltip: 'Connection is active and fully synced.',
      base: 'bg-green-600 text-white',
      glow: 'shadow-[0_0_8px_rgba(34,197,94,0.4)]'
    },
    WARNING: {
      tooltip: 'Sync issue detected — review settings.',
      base: 'bg-yellow-400 text-black',
      glow: 'shadow-[0_0_8px_rgba(250,204,21,0.4)]'
    },
    DISCONNECTED: {
      tooltip: 'Disconnected — needs reauthentication.',
      base: 'bg-red-600 text-white',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]'
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        duration: 1.6,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-2xl p-6 space-y-6 shadow-xl border bg-white border-gray-200 text-gray-900"
    >
      <h2 className="text-3xl font-semibold flex items-center gap-3">
        <FaLink className="text-blue-500" />
        Integration Summary
      </h2>

      {integrationGroups.map((group, index) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="rounded-xl overflow-hidden border shadow-md bg-white border-gray-200"
        >
          <div className="bg-gradient-to-r from-[#01818E] to-[#00C9C8] text-white font-semibold px-5 py-2 text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(1,129,142,0.5)]">
            <FaPlug className="text-white text-sm" />
            {group.title}
          </div>

          <ul className="divide-y divide-gray-100 text-sm">
            {group.integrations.map(([name, status]) => {
              const { tooltip, base, glow } = statusConfig[status];

              return (
                <li
                  key={name}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-5 py-3 transition gap-2 hover:bg-gray-50"
                >
                  <a
                    href="#"
                    className="text-blue-600 underline flex items-center gap-2 hover:text-blue-500 transition"
                  >
                    <FaLink className="text-sm opacity-80" />
                    <span className="font-medium">{name}</span>
                  </a>

                  <Tooltip.Provider delayDuration={200}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <motion.span
                          className={`px-3 py-1 rounded-full text-xs font-bold transition transform ${base} ${glow}`}
                          variants={['WARNING', 'DISCONNECTED'].includes(status) ? pulseAnimation : {}}
                          animate={['WARNING', 'DISCONNECTED'].includes(status) ? 'animate' : ''}
                        >
                          {status}
                        </motion.span>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        className="px-3 py-2 rounded shadow-lg text-xs max-w-[200px] bg-gray-900 text-white"
                        side="top"
                        sideOffset={5}
                      >
                        {tooltip}
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default IntegrationSummary;
