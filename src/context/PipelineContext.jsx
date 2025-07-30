import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchPipelineLeads, 
  fetchPipelineMetrics,
  fetchStageTags,
  createNewLead,
  updateLeadDetails,
  deleteLead,
  moveLeadToStage,
  addTagsToLead,
  setupRealtimeUpdates,
  refreshPipelineData,
  testApiConnection,
  testContactsExist,
  PIPELINE_STAGES,
  STAGE_TAGS
} from '../services/pipelineApi';

const PipelineContext = createContext();

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};

export const PipelineProvider = ({ children }) => {
  const [leadsByStage, setLeadsByStage] = useState({});
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load initial data
  useEffect(() => {
    loadPipelineData();
  }, []);

  // Setup real-time updates
  useEffect(() => {
    const unsubscribe = setupRealtimeUpdates((payload) => {
      console.log('🔄 Real-time update received:', payload);
      handleRealtimeUpdate(payload);
    });

    return unsubscribe;
  }, []);

  const loadPipelineData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First test API connection
      console.log('🧪 Testing API connection before loading data...');
      const apiTest = await testApiConnection();
      
      if (!apiTest.success) {
        console.error('❌ API connection failed:', apiTest.error);
        setError(`API Connection Failed: ${apiTest.error}`);
        setLoading(false);
        return;
      }

      console.log('✅ API connection successful, testing for contacts...');
      
      // Test if contacts exist
      const contactsTest = await testContactsExist();
      if (contactsTest.success) {
        console.log(`📊 Found ${contactsTest.data.contactsCount} contacts in LeadConnector`);
        if (contactsTest.data.contactsCount === 0) {
          console.log('⚠️ No contacts found - pipeline will be empty');
        }
      }

      console.log('✅ Loading pipeline data...');
      
      const [leadsResponse, metricsResponse] = await Promise.all([
        fetchPipelineLeads(),
        fetchPipelineMetrics()
      ]);

      if (leadsResponse.success && metricsResponse.success) {
        setLeadsByStage(leadsResponse.data.leads);
        setMetrics(metricsResponse.data);
        setLastUpdated(new Date().toISOString());
        console.log('✅ Pipeline data loaded successfully');
      } else {
        const errorMsg = leadsResponse.error || metricsResponse.error;
        console.error('❌ Pipeline data loading failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error loading pipeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (payload) => {
    const { eventType, data } = payload;

    if (eventType === 'REFRESH' && data) {
      // Handle periodic refresh from LeadConnector
      setLeadsByStage(data.leads);
      setMetrics(data.metrics);
      setLastUpdated(new Date().toISOString());
      console.log('✅ Pipeline data updated from periodic refresh');
    }
  };

  const updateMetrics = async () => {
    try {
      const response = await fetchPipelineMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('❌ Error updating metrics:', error);
    }
  };

  const addLead = async (stage, leadData) => {
    try {
      const response = await createNewLead({ ...leadData, stage });
      if (response.success) {
        // Immediately refresh data to show the new lead
        console.log('🔄 Refreshing pipeline data after adding lead...');
        await loadPipelineData();
        console.log('✅ Pipeline data refreshed after adding lead');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error adding lead:', error);
      throw error;
    }
  };

  const updateLead = async (leadId, updates) => {
    try {
      const response = await updateLeadDetails(leadId, updates);
      if (response.success) {
        // Immediately refresh data to show updated lead
        console.log('🔄 Refreshing pipeline data after updating lead...');
        await loadPipelineData();
        console.log('✅ Pipeline data refreshed after updating lead');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      throw error;
    }
  };

  const removeLead = async (leadId) => {
    try {
      const response = await deleteLead(leadId);
      if (response.success) {
        // Remove from local state
        setLeadsByStage(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(stageTitle => {
            newData[stageTitle] = newData[stageTitle].filter(lead => lead.id !== leadId);
          });
          return newData;
        });
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      throw error;
    }
  };

  const moveLead = async (leadId, fromStage, toStage) => {
    try {
      const response = await moveLeadToStage(leadId, toStage, fromStage);
      if (response.success) {
        // Update local state
        setLeadsByStage(prevData => {
          const newData = { ...prevData };
          
          // Find and remove from source stage
          const sourceStage = newData[fromStage] || [];
          const leadIndex = sourceStage.findIndex(lead => lead.id === leadId);
          
          if (leadIndex >= 0) {
            const lead = sourceStage[leadIndex];
            
            // Remove from source stage
            newData[fromStage] = sourceStage.filter((_, index) => index !== leadIndex);
            
            // Add to target stage
            if (!newData[toStage]) {
              newData[toStage] = [];
            }
            
            newData[toStage].push({
              ...lead,
              stage: toStage,
              updatedAt: new Date().toISOString()
            });
          }
          
          return newData;
        });
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error moving lead:', error);
      throw error;
    }
  };

  const updateLeadTags = async (leadId, tags) => {
    try {
      const response = await addTagsToLead(leadId, tags);
      if (response.success) {
        // Immediately refresh data to show updated tags
        console.log('🔄 Refreshing pipeline data after updating tags...');
        await loadPipelineData();
        console.log('✅ Pipeline data refreshed after updating tags');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error updating lead tags:', error);
      throw error;
    }
  };

  const getStageTags = async (stageName) => {
    try {
      const response = await fetchStageTags(stageName);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
  } catch (error) {
      console.error('❌ Error fetching stage tags:', error);
      return STAGE_TAGS[stageName] || [];
    }
  };

  const refreshData = () => {
    loadPipelineData();
  };

  const manualRefresh = async () => {
    try {
      console.log('🔄 Manual refresh requested...');
      
      // Refresh pipeline data directly from LeadConnector
      const response = await refreshPipelineData();
      
      if (response.success) {
        setLeadsByStage(response.data.leads);
        setMetrics(response.data.metrics);
        setLastUpdated(new Date().toISOString());
        console.log('✅ Manual refresh completed successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      setError(error.message);
    }
  };

  const value = {
    // State
    leadsByStage,
    metrics,
    loading,
    error,
    lastUpdated,
    
    // Actions
    addLead,
    updateLead,
    removeLead,
    moveLead,
    updateLeadTags,
    getStageTags,
    refreshData,
    manualRefresh,
    
    // Constants
    stages: PIPELINE_STAGES,
    stageTags: STAGE_TAGS
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}; 

export { PipelineContext }; 