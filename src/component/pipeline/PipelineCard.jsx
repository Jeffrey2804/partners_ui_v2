import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';
import { usePipeline } from '../../context/PipelineContext';
import { toast } from 'react-hot-toast';

const PipelineCard = ({ stage, leads = [], metrics = {} }) => {
  const { getStageTags, updateLeadTags } = usePipeline();
  const [showTags, setShowTags] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedLeads, setSortedLeads] = useState([]);
  const [previousLeadsCount, setPreviousLeadsCount] = useState(0);

  // Sort leads by recency whenever leads prop changes
  useEffect(() => {
    const sorted = [...leads].sort((a, b) => 
      new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
    setSortedLeads(sorted);
    
    // Check if new leads were added
    if (leads.length > previousLeadsCount) {
      console.log(`🆕 New lead added to ${stage.title}: ${leads.length - previousLeadsCount} new lead(s)`);
    }
    setPreviousLeadsCount(leads.length);
  }, [leads, stage.title, previousLeadsCount]);

  const {
    leads: totalLeads = leads.length,
    avgTime = '0:00',
    conversion = 0
  } = metrics;

  const loadStageTags = async () => {
    if (availableTags.length === 0) {
      setLoading(true);
      try {
        const tags = await getStageTags(stage.title);
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
        toast.error('Failed to load tags');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTagToggle = async (leadId, tag) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const currentTags = lead.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];

      await updateLeadTags(leadId, newTags);
    } catch (error) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    }
  };

  const getStageIcon = (stageTitle) => {
    const iconMap = {
      'New Lead': '👤',
      'Contacted': '📞',
      'Application Started': '📝',
      'Pre-Approved': '✅',
      'In Underwriting': '🔍',
      'Closed': '🎯'
    };
    return iconMap[stageTitle] || '📊';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateTotalValue = () => {
    return leads.reduce((sum, lead) => sum + (lead.loanAmount || 0), 0);
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Header */}
      <div
        className={`${stage.color} text-white px-4 py-3 flex justify-between items-center`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStageIcon(stage.title)}</span>
          <h3 className="text-sm font-bold tracking-wide uppercase">
            {stage.title}
          </h3>
        </div>
        <span className="bg-white/20 rounded-full px-2 text-xs font-semibold">
          {totalLeads}
        </span>
      </div>

      {/* Metrics Section */}
      <div className="p-4 space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiUsers size={16} className="text-gray-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {totalLeads}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Leads</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiClock size={16} className="text-gray-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {avgTime}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Time</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiTrendingUp size={16} className="text-gray-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {conversion}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Conversion</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
            <span className="text-gray-900 dark:text-white font-medium">{conversion}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
              initial={{ width: 0 }}
              animate={{ width: `${conversion}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Total Value */}
        {calculateTotalValue() > 0 && (
          <div className="text-center py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(calculateTotalValue())}
            </div>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <FiTag size={12} className="mr-1" />
            Tags
          </div>
          <button
            onClick={() => {
              setShowTags(!showTags);
              if (!showTags) loadStageTags();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {showTags ? 'Hide' : 'Manage'}
          </button>
        </div>

        {/* Tag Summary - Show only unique tags with counts */}
        <div className="mb-3">
          {(() => {
            const tagCounts = {};
            leads.forEach(lead => {
              lead.tags?.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            });

            const uniqueTags = Object.keys(tagCounts).slice(0, 3); // Show max 3 tags
            
            if (uniqueTags.length === 0) {
              return (
                <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                  No tags assigned
                </div>
              );
            }

            return (
              <div className="flex flex-wrap gap-1.5">
                {uniqueTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  >
                    <span className="truncate max-w-16">{tag}</span>
                    {tagCounts[tag] > 1 && (
                      <span className="ml-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full px-1.5 py-0.5 text-xs font-bold">
                        {tagCounts[tag]}
                      </span>
                    )}
                  </span>
                ))}
                {Object.keys(tagCounts).length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                    +{Object.keys(tagCounts).length - 3} more
                  </span>
                )}
              </div>
            );
          })()}
        </div>

        {/* Tag Selection Modal */}
        <AnimatePresence>
          {showTags && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
            >
              {loading ? (
                <div className="text-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Available Tags for {stage.title}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          // Apply tag to all leads in this stage
                          leads.forEach(lead => {
                            handleTagToggle(lead.id, tag);
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-300 dark:border-gray-500 hover:border-blue-300 dark:hover:border-blue-600"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leads List */}
      <div className="px-4 pb-4">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
          <span>All Leads ({leads.length})</span>
          {leads.length > previousLeadsCount && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
            >
              New!
            </motion.span>
          )}
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sortedLeads.map((lead, index) => (
            <motion.div
              key={`${lead.id}-${leads.length}-${lead.updatedAt || lead.createdAt}`}
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`text-xs p-2.5 rounded-lg border transition-all duration-300 ${
                index === 0 && leads.length > previousLeadsCount 
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {lead.name || 'Unknown Lead'}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-1.5">
                {lead.loanType} • {formatCurrency(lead.loanAmount)}
              </div>
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lead.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {lead.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-500">
                      +{lead.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
          {leads.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <div className="text-2xl mb-2">📭</div>
              <div className="text-xs font-medium">No leads yet</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PipelineCard; 