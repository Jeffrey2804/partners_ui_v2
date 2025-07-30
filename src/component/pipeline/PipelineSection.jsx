import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '../../context/PipelineContext';
import PipelineCard from './PipelineCard';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiPlus, FiFilter, FiTrendingUp } from 'react-icons/fi';

const PipelineSection = ({ isAdmin = false }) => {
  const { 
    leadsByStage, 
    metrics, 
    loading, 
    error, 
    stages,
    manualRefresh,
    addLead,
    updateLead,
    moveLead
  } = usePipeline();

  const [filterStage, setFilterStage] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [leadsByStage]);

  const handleFilterChange = (stage) => {
    setFilterStage(stage);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await manualRefresh();
      toast.success('✅ Pipeline data refreshed!');
    } catch (error) {
      toast.error('❌ Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddLead = async (stageTitle, newLead) => {
    try {
      await addLead(stageTitle, newLead);
      toast.success('✅ Lead added successfully!');
    } catch (error) {
      console.error('❌ Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    try {
      await updateLead(leadId, updates);
      toast.success('✅ Lead updated successfully!');
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const handleMoveLead = async (leadId, fromStage, toStage) => {
    try {
      await moveLead(leadId, fromStage, toStage);
      toast.success('✅ Lead moved successfully!');
    } catch (error) {
      console.error('❌ Error moving lead:', error);
      toast.error('Failed to move lead');
    }
  };

  const filteredStages = filterStage === 'All' 
    ? stages 
    : stages.filter(stage => stage.title === filterStage);

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-10 py-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-lg bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01818E]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-10 py-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-lg bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading pipeline data: {error}</p>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full px-4 sm:px-6 md:px-10 py-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-lg bg-white dark:bg-gray-900"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2">
            🧭 Pipeline Overview
          </h2>
          <div className="mt-1 h-1 w-28 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStage}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#01818E]"
            >
              <option value="All">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.title} value={stage.title}>
                  {stage.title}
                </option>
              ))}
            </select>
          </div>

          {/* Metrics Toggle */}
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiTrendingUp className="w-4 h-4" />
            {showMetrics ? 'Hide' : 'Show'} Metrics
          </button>

          {/* Last Updated and Refresh Button */}
          {lastUpdated && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
            </div>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#01818E]">
                {Object.values(leadsByStage).reduce((total, leads) => total + leads.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics?.conversionRate || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.avgTimeInPipeline || '0:00'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${(metrics?.totalValue || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
        </div>
      </div>
        </motion.div>
      )}

      {/* Pipeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <AnimatePresence>
          {filteredStages.map((stage) => (
              <motion.div
                key={stage.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              >
                <PipelineCard
                  stage={stage}
                leads={leadsByStage[stage.title] || []}
                metrics={metrics?.stages?.[stage.title] || {}}
                onAddLead={isAdmin ? (newLead) => handleAddLead(stage.title, newLead) : undefined}
                onUpdateLead={isAdmin ? handleUpdateLead : undefined}
                onMoveLead={isAdmin ? handleMoveLead : undefined}
                isAdmin={isAdmin}
                />
              </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredStages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
            No pipeline stages found
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Try adjusting your filter or check your pipeline configuration.
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default PipelineSection; 