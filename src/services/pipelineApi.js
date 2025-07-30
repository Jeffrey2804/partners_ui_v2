// 🚀 Pipeline API Service
// Handles all pipeline-related API calls for leads, tags, and real-time updates

import { toast } from 'react-hot-toast';

// 🔧 API Configuration based on your curl command
const LEAD_CONNECTOR_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f', // Your actual token
  locationId: 'b7vHWUGVUNQGoIlAXabY', // Your location ID
  version: '2021-07-28'
};

// 📊 Pipeline Stages Configuration
const PIPELINE_STAGES = [
  { title: 'New Lead', color: 'bg-teal-600', icon: '👤' },
  { title: 'Contacted', color: 'bg-gray-500', icon: '📞' },
  { title: 'Application Started', color: 'bg-blue-500', icon: '📝' },
  { title: 'Pre-Approved', color: 'bg-red-500', icon: '✅' },
  { title: 'In Underwriting', color: 'bg-orange-500', icon: '🔍' },
  { title: 'Closed', color: 'bg-green-500', icon: '🎯' }
];

// 🏷️ Tags Management for each stage
const STAGE_TAGS = {
  'New Lead': ['New Lead'],
  'Contacted': ['Contacted'],
  'Application Started': ['Application Started'],
  'Pre-Approved': ['Pre-Approved'],
  'In Underwriting': ['In Underwriting'],
  'Closed': ['Closed']
};

// 🧹 Function to clean old tags and keep only main stage tags
const cleanTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  
  const validTags = Object.values(STAGE_TAGS).flat();
  return tags.filter(tag => validTags.includes(tag));
};

// ============================================================================
// 📥 GET REQUESTS
// ============================================================================

/**
 * 🎯 GET - Fetch all leads with pipeline metrics
 * Returns leads categorized by stage with real-time metrics
 */
export const fetchPipelineLeads = async () => {
  try {
    // Use GET request to fetch contacts (correct endpoint from documentation)
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 API Response Data:', data);
    console.log('📊 API Response Type:', typeof data);
    console.log('📊 API Response Keys:', Object.keys(data));
    
    // Handle different response structures
    let leads = [];
    if (Array.isArray(data)) {
      leads = data;
    } else if (data.contacts && Array.isArray(data.contacts)) {
      leads = data.contacts;
    } else if (data.data && Array.isArray(data.data)) {
      leads = data.data;
    } else if (data.results && Array.isArray(data.results)) {
      leads = data.results;
    } else {
      console.warn('⚠️ Unexpected data structure:', data);
      leads = [];
    }

    console.log('📊 Processed Leads Count:', leads.length);
    console.log('📊 First Lead Sample:', leads[0]);

    // Transform and categorize leads by stage
    const categorizedLeads = categorizeLeadsByStage(leads);
    console.log('📊 Categorized Leads:', categorizedLeads);
    
    // Calculate metrics for each stage
    const pipelineMetrics = calculatePipelineMetrics(categorizedLeads);

    return {
      success: true,
      data: {
        leads: categorizedLeads,
        metrics: pipelineMetrics,
        stages: PIPELINE_STAGES
      }
    };

  } catch (error) {
    console.error('❌ Error fetching pipeline leads:', error);
    return {
      success: false,
      error: error.message,
      data: { leads: {}, metrics: {}, stages: PIPELINE_STAGES }
    };
  }
};

/**
 * 🏷️ GET - Fetch tags for specific stage
 * Returns available tags for a specific pipeline stage
 */
export const fetchStageTags = async (stageName) => {
  try {
    return {
      success: true,
      data: STAGE_TAGS[stageName] || []
    };
  } catch (error) {
    console.error('❌ Error fetching stage tags:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * 🏷️ GET - Fetch all available tags
 * Returns list of all available tags for leads
 */
export const fetchAvailableTags = async () => {
  try {
    // Combine all stage tags
    const allTags = Object.values(STAGE_TAGS).flat();
    const uniqueTags = [...new Set(allTags)];
    
    return {
      success: true,
      data: uniqueTags
    };
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * 📊 GET - Fetch pipeline metrics and analytics
 * Returns real-time metrics for each pipeline stage
 */
export const fetchPipelineMetrics = async () => {
  try {
    const leadsResponse = await fetchPipelineLeads();
    
    if (!leadsResponse.success) {
      throw new Error(leadsResponse.error);
    }

    const metrics = calculateDetailedMetrics(leadsResponse.data.leads);
    
    return {
      success: true,
      data: metrics
    };

  } catch (error) {
    console.error('❌ Error fetching pipeline metrics:', error);
    return {
      success: false,
      error: error.message,
      data: {}
    };
  }
};

/**
 * 🔍 GET - Fetch leads by specific stage
 * Returns leads for a specific pipeline stage
 */
export const fetchLeadsByStage = async (stageName) => {
  try {
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        }
      }
    );

    if (!response.ok) {
      console.error(`❌ API Response Error for stage ${stageName}:`, response.status, response.statusText);
      return {
        success: false,
        error: `HTTP error! Status: ${response.status}`,
        data: []
      };
    }

    const data = await response.json();
    console.log(`📊 API Response Data for stage ${stageName}:`, data);
    
    const leads = data.contacts || data || [];
    
    // Filter leads by stage
    const stageLeads = leads.filter(lead => {
      const leadStage = lead.customField?.stage || lead.stage || 'New Lead';
      return leadStage === stageName;
    });

    return {
      success: true,
      data: stageLeads
    };

  } catch (error) {
    console.error(`❌ Error fetching leads for stage ${stageName}:`, error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// ============================================================================
// 📤 POST REQUESTS
// ============================================================================

/**
 * ➕ POST - Create new lead
 * Creates a new lead and assigns to specified pipeline stage
 */
export const createNewLead = async (leadData) => {
  try {
    const { name, email, phone, address, loanType, loanAmount, closeDate, stage, tags, notes } = leadData;

    console.log('🆕 Creating new lead with data:', leadData);

    // Validate required fields
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    // Automatically assign the stage tag based on the stage
    const stageToUse = stage || 'New Lead';
    const stageTag = STAGE_TAGS[stageToUse] ? STAGE_TAGS[stageToUse][0] : 'New Lead';
    const finalTags = tags ? [...tags, stageTag] : [stageTag];
    
    const leadPayload = {
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: email,
      phone: phone || '',
      address: address || '',
      customField: {
        stage: stageToUse,
        loanType: loanType || 'Conventional',
        loanAmount: loanAmount || 0,
        closeDate: closeDate || '',
        tags: finalTags,
        notes: notes || '',
        status: 'On Track',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    console.log('🆕 Lead payload:', leadPayload);

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify(leadPayload),
      }
    );

    console.log('🆕 Response status:', response.status);
    console.log('🆕 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🆕 Error response body:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const newLead = await response.json();
    console.log('🆕 Created lead response:', newLead);
    
    toast.success('✅ Lead created successfully!');
    
    return {
      success: true,
      data: newLead
    };

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    toast.error(`❌ Failed to create lead: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 🏷️ POST - Add tags to lead
 * Adds tags to a specific lead
 */
export const addTagsToLead = async (leadId, tags) => {
  try {
    if (!leadId || !tags || tags.length === 0) {
      throw new Error('Lead ID and tags are required');
    }

    // Clean tags to only include main stage tags
    const cleanedTags = cleanTags(tags);
    console.log('🧹 Original tags:', tags);
    console.log('🧹 Cleaned tags:', cleanedTags);

    // Update in LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          customField: {
            tags: cleanedTags
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Tags updated successfully!');
    
    return {
      success: true,
      data: { leadId, tags: cleanedTags }
    };

  } catch (error) {
    console.error('❌ Error adding tags:', error);
    toast.error(`❌ Failed to update tags: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 📊 POST - Update lead stage (move between pipeline stages)
 * Moves a lead from one stage to another
 */
export const moveLeadToStage = async (leadId, newStage, oldStage) => {
  try {
    if (!leadId || !newStage) {
      throw new Error('Lead ID and new stage are required');
    }

    // Get the appropriate tag for the new stage
    const newStageTag = STAGE_TAGS[newStage] ? STAGE_TAGS[newStage][0] : 'New Lead';
    
    // Remove old stage tag and add new stage tag
    const oldStageTag = STAGE_TAGS[oldStage] ? STAGE_TAGS[oldStage][0] : null;
    
    // First, get current tags to update them
    const currentResponse = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        }
      }
    );

    let currentTags = [];
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      currentTags = currentData.customField?.tags || currentData.tags || [];
    }

    // Remove old stage tag and add new stage tag
    const updatedTags = currentTags
      .filter(tag => tag !== oldStageTag)
      .concat([newStageTag]);

    // Update in LeadConnector with new stage and tags
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          customField: {
            stage: newStage,
            tags: updatedTags,
            updatedAt: new Date().toISOString()
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success(`✅ Lead moved to ${newStage}`);
    
    return {
      success: true,
      data: { leadId, newStage, oldStage, tags: updatedTags }
    };

  } catch (error) {
    console.error('❌ Error moving lead:', error);
    toast.error(`❌ Failed to move lead: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 📝 POST - Update lead details
 * Updates lead information
 */
export const updateLeadDetails = async (leadId, updates) => {
  try {
    if (!leadId || !updates) {
      throw new Error('Lead ID and updates are required');
    }

    // Update in LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          firstName: updates.name?.split(' ')[0] || '',
          lastName: updates.name?.split(' ').slice(1).join(' ') || '',
          email: updates.email,
          phone: updates.phone,
          address: updates.address,
          customField: {
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Lead updated successfully!');
    
    return {
      success: true,
      data: { leadId, updates }
    };

  } catch (error) {
    console.error('❌ Error updating lead:', error);
    toast.error(`❌ Failed to update lead: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 🗑️ DELETE - Delete lead
 * Removes a lead from the system
 */
export const deleteLead = async (leadId) => {
  try {
    if (!leadId) {
      throw new Error('Lead ID is required');
    }

    // Delete from LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Lead deleted successfully!');
    
    return {
      success: true,
      data: { leadId }
    };

  } catch (error) {
    console.error('❌ Error deleting lead:', error);
    toast.error(`❌ Failed to delete lead: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

// ============================================================================
// 🔄 REAL-TIME UPDATES
// ============================================================================

/**
 * 🔄 Manual refresh from LeadConnector
 * Fetches fresh data from LeadConnector API and updates local state
 */
export const refreshPipelineData = async () => {
  try {
    console.log('🔄 Manually refreshing pipeline data from LeadConnector...');
    
    const response = await fetchPipelineLeads();
    
    if (response.success) {
      console.log('✅ Pipeline data refreshed successfully');
      return response;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('❌ Error refreshing pipeline data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 🔄 Setup periodic refresh for pipeline updates
 * Refreshes data from LeadConnector periodically
 */
export const setupRealtimeUpdates = (onUpdate) => {
  // Set up periodic refresh from LeadConnector (every 30 seconds)
  const refreshInterval = setInterval(async () => {
    try {
      console.log('🔄 Periodic refresh from LeadConnector...');
      const response = await fetchPipelineLeads();
      
      if (response.success) {
        // Trigger update callback with fresh data
        onUpdate({
          eventType: 'REFRESH',
          data: response.data
        });
        console.log('✅ Periodic refresh completed');
      }
    } catch (error) {
      console.error('❌ Periodic refresh failed:', error);
    }
  }, 30000); // 30 seconds

  return () => {
    clearInterval(refreshInterval);
  };
};

// ============================================================================
// 🧪 TEST FUNCTIONS
// ============================================================================

/**
 * 🧪 Test API connectivity
 * Simple test to check if the API is working
 */
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    console.log('🔧 Config:', {
      baseUrl: LEAD_CONNECTOR_CONFIG.baseUrl,
      locationId: LEAD_CONNECTOR_CONFIG.locationId,
      version: LEAD_CONNECTOR_CONFIG.version,
      token: LEAD_CONNECTOR_CONFIG.token.substring(0, 10) + '...'
    });

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        }
      }
    );

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response Body:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Test Successful!');
    console.log('📊 Response Data:', data);

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 🧪 Test if there are any contacts in LeadConnector
 * Simple test to check if the account has any contacts
 */
export const testContactsExist = async () => {
  try {
    console.log('🧪 Testing if contacts exist in LeadConnector...');
    
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🧪 Contacts test response:', data);
    
    let contactsCount = 0;
    if (Array.isArray(data)) {
      contactsCount = data.length;
    } else if (data.contacts && Array.isArray(data.contacts)) {
      contactsCount = data.contacts.length;
    } else if (data.data && Array.isArray(data.data)) {
      contactsCount = data.data.length;
    } else if (data.results && Array.isArray(data.results)) {
      contactsCount = data.results.length;
    }

    console.log(`🧪 Found ${contactsCount} contacts in LeadConnector`);
    
    return {
      success: true,
      data: {
        contactsCount,
        hasContacts: contactsCount > 0,
        rawData: data
      }
    };

  } catch (error) {
    console.error('❌ Error testing contacts:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ============================================================================
// 🛠️ HELPER FUNCTIONS
// ============================================================================

/**
 * Categorize leads by pipeline stage
 */
const categorizeLeadsByStage = (leads) => {
  const categorized = {};
  
  PIPELINE_STAGES.forEach(stage => {
    categorized[stage.title] = [];
  });

  console.log('🔍 Processing leads:', leads.length);

  leads.forEach((lead, index) => {
    console.log(`🔍 Processing lead ${index + 1}:`, lead);
    
    // Get all tags from the lead (don't clean them yet to preserve original tags)
    const rawTags = lead.customField?.tags || lead.tags || [];
    console.log(`🔍 Lead ${index + 1} original tags:`, rawTags);
    
    // Determine stage based on tags and custom fields
    let stage = 'New Lead'; // Default stage
    
    // Check for explicit stage field first
    if (lead.customField?.stage) {
      stage = lead.customField.stage;
    } else if (lead.stage) {
      stage = lead.stage;
    } else if (lead.status) {
      stage = lead.status;
    } else if (lead.pipelineStage) {
      stage = lead.pipelineStage;
    } else if (lead.stageName) {
      stage = lead.stageName;
    } else {
      // Map tags to stages (case-insensitive)
      const tagStageMap = {
        // Main stage tags only
        'new lead': 'New Lead',
        'contacted': 'Contacted',
        'application started': 'Application Started',
        'pre-approved': 'Pre-Approved',
        'pre approved': 'Pre-Approved',
        'in underwriting': 'In Underwriting',
        'closed': 'Closed'
      };
      
      // Check each tag to determine stage (case-insensitive)
      for (const tag of rawTags) {
        const lowerTag = tag.toLowerCase();
        if (tagStageMap[lowerTag]) {
          stage = tagStageMap[lowerTag];
          console.log(`🔍 Mapped tag "${tag}" to stage "${stage}"`);
          break; // Use the first matching tag
        }
      }
    }
    
    // Now clean the tags after determining the stage
    const leadTags = cleanTags(rawTags);
    console.log(`🔍 Lead ${index + 1} cleaned tags:`, leadTags);

    console.log(`🔍 Lead ${index + 1} final stage:`, stage);

    // Try different possible name field locations
    let name = 'Unknown';
    if (lead.firstName && lead.lastName) {
      name = `${lead.firstName} ${lead.lastName}`;
    } else if (lead.name) {
      name = lead.name;
    } else if (lead.fullName) {
      name = lead.fullName;
    } else if (lead.displayName) {
      name = lead.displayName;
    }

    // Automatically assign the stage tag based on the determined stage
    const stageTag = STAGE_TAGS[stage] ? STAGE_TAGS[stage][0] : 'New Lead';
    const finalTags = leadTags.includes(stageTag) ? leadTags : [...leadTags, stageTag];
    
    const leadItem = {
      id: lead._id || lead.id || lead.contactId || `lead-${index}`,
      name: name,
      email: lead.email || lead.emailAddress || '',
      phone: lead.phone || lead.phoneNumber || lead.mobile || '',
      address: lead.address || lead.customField?.address || '',
      loanType: lead.customField?.loanType || lead.loanType || 'Conventional',
      loanAmount: lead.customField?.loanAmount || lead.loanAmount || 0,
      closeDate: lead.customField?.closeDate || lead.closeDate || '',
      status: lead.customField?.status || lead.status || 'On Track',
      tags: finalTags,
      notes: lead.customField?.notes || lead.notes || '',
      stage: stage,
      createdAt: lead.customField?.createdAt || lead.createdAt || lead.created_at || new Date().toISOString(),
      updatedAt: lead.customField?.updatedAt || lead.updatedAt || lead.updated_at || new Date().toISOString()
    };

    console.log(`🔍 Processed lead item:`, leadItem);

    if (categorized[stage]) {
      categorized[stage].push(leadItem);
    } else {
      console.log(`⚠️ Unknown stage "${stage}", adding to "New Lead"`);
      categorized['New Lead'].push(leadItem);
    }
  });

  console.log('📊 Final categorized leads:', categorized);
  return categorized;
};

/**
 * Calculate pipeline metrics for each stage
 */
const calculatePipelineMetrics = (categorizedLeads) => {
  const metrics = {};

  PIPELINE_STAGES.forEach(stage => {
    const leads = categorizedLeads[stage.title] || [];
    const totalLeads = leads.length;
    
    // Calculate average time in stage (mock data for now)
    const avgTime = calculateAverageTime(leads);
    
    // Calculate conversion rate (mock data for now)
    const conversion = calculateConversionRate(stage.title);

    metrics[stage.title] = {
      leads: totalLeads,
      avgTime: avgTime,
      conversion: conversion,
      lastUpdated: new Date().toISOString()
    };
  });

  return metrics;
};

/**
 * Calculate detailed metrics with analytics
 */
const calculateDetailedMetrics = (categorizedLeads) => {
  const metrics = calculatePipelineMetrics(categorizedLeads);
  
  // Add overall pipeline metrics
  const totalLeads = Object.values(categorizedLeads).reduce((sum, leads) => sum + leads.length, 0);
  const totalValue = Object.values(categorizedLeads).reduce((sum, leads) => {
    return sum + leads.reduce((stageSum, lead) => stageSum + (lead.loanAmount || 0), 0);
  }, 0);

  return {
    ...metrics,
    overall: {
      totalLeads,
      totalValue,
      averageLoanAmount: totalLeads > 0 ? totalValue / totalLeads : 0,
      lastUpdated: new Date().toISOString()
    }
  };
};

/**
 * Calculate average time in stage (mock implementation)
 */
const calculateAverageTime = (leads) => {
  if (leads.length === 0) return '0:00';
  
  // Mock calculation - in real app, calculate based on createdAt/updatedAt
  const avgMinutes = Math.floor(Math.random() * 300) + 30; // 30-330 minutes
  const hours = Math.floor(avgMinutes / 60);
  const minutes = avgMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Calculate conversion rate (mock implementation)
 */
const calculateConversionRate = (stage) => {
  // Mock conversion rates based on stage
  const conversionRates = {
    'New Lead': 12,
    'Contacted': 10,
    'Application Started': 8,
    'Pre-Approved': 5,
    'In Underwriting': 3,
    'Closed': 2
  };
  
  return conversionRates[stage] || 0;
};



export { PIPELINE_STAGES, STAGE_TAGS }; 