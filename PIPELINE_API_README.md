# 🚀 Pipeline API Service Documentation

This document provides comprehensive documentation for the Pipeline API service, including all GET and POST endpoints, real-time updates, and usage examples.

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Configuration](#api-configuration)
3. [GET Endpoints](#get-endpoints)
4. [POST Endpoints](#post-endpoints)
5. [Real-time Updates](#real-time-updates)
6. [Component Integration](#component-integration)
7. [Usage Examples](#usage-examples)
8. [Error Handling](#error-handling)

## 🎯 Overview

The Pipeline API service provides a complete solution for managing leads through different pipeline stages with real-time updates, metrics calculation, and tag management. It integrates with both LeadConnector API and Supabase for data persistence and real-time synchronization.

### Key Features:
- ✅ **Real-time lead management** across pipeline stages
- ✅ **Tag system** for lead categorization
- ✅ **Metrics calculation** (leads count, avg time, conversion rates)
- ✅ **Real-time updates** via Supabase subscriptions
- ✅ **Comprehensive error handling** with user feedback
- ✅ **Debounced saves** for better performance

## 🔧 API Configuration

### LeadConnector Configuration
```javascript
const LEAD_CONNECTOR_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  locationId: 'b7vHWUGVUNQGoIlAXabY',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-07-28'
};
```

### Pipeline Stages
```javascript
const PIPELINE_STAGES = [
  { title: 'New Lead', color: 'bg-teal-600', icon: '👤' },
  { title: 'Contacted', color: 'bg-gray-500', icon: '📞' },
  { title: 'Application Started', color: 'bg-blue-500', icon: '📝' },
  { title: 'Pre-Approved', color: 'bg-red-500', icon: '✅' },
  { title: 'In Underwriting', color: 'bg-orange-500', icon: '🔍' },
  { title: 'Closed', color: 'bg-green-500', icon: '🎯' }
];
```

### Available Tags
```javascript
const AVAILABLE_TAGS = [
  'High Priority', 'VIP', 'Hot Lead', 'Follow Up', 'Documentation Needed',
  'Credit Issues', 'Income Verification', 'Property Issues', 'Rate Lock',
  'Pre-Approved', 'Conditional Approval', 'Clear to Close'
];
```

## 📥 GET Endpoints

### 1. Fetch Pipeline Leads
**Endpoint:** `GET /contacts/?locationId={locationId}`

**Description:** Fetches all leads and categorizes them by pipeline stage with real-time metrics.

**Response:**
```javascript
{
  success: true,
  data: {
    leads: {
      'New Lead': [
        {
          id: 'lead-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St',
          loanType: 'Conventional',
          loanAmount: 300000,
          closeDate: '2024-12-31',
          status: 'On Track',
          tags: ['High Priority', 'VIP'],
          notes: 'Initial contact made',
          stage: 'New Lead',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      'Contacted': [...],
      // ... other stages
    },
    metrics: {
      'New Lead': {
        leads: 25,
        avgTime: '2:30',
        conversion: 12,
        lastUpdated: '2024-01-01T00:00:00Z'
      },
      // ... other stages
    },
    stages: PIPELINE_STAGES
  }
}
```

**Usage:**
```javascript
import { fetchPipelineLeads } from '../services/pipelineApi';

const loadPipeline = async () => {
  const response = await fetchPipelineLeads();
  if (response.success) {
    setPipelineData(response.data);
  } else {
    console.error('Failed to load pipeline:', response.error);
  }
};
```

### 2. Fetch Available Tags
**Endpoint:** `GET /tags` (static data)

**Description:** Returns all available tags for lead categorization.

**Response:**
```javascript
{
  success: true,
  data: [
    'High Priority', 'VIP', 'Hot Lead', 'Follow Up', 
    'Documentation Needed', 'Credit Issues', 'Income Verification'
  ]
}
```

**Usage:**
```javascript
import { fetchAvailableTags } from '../services/pipelineApi';

const loadTags = async () => {
  const response = await fetchAvailableTags();
  if (response.success) {
    setAvailableTags(response.data);
  }
};
```

### 3. Fetch Pipeline Metrics
**Endpoint:** `GET /metrics`

**Description:** Returns detailed metrics and analytics for each pipeline stage.

**Response:**
```javascript
{
  success: true,
  data: {
    'New Lead': {
      leads: 25,
      avgTime: '2:30',
      conversion: 12,
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    'Contacted': {
      leads: 18,
      avgTime: '3:20',
      conversion: 10,
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    // ... other stages
    overall: {
      totalLeads: 70,
      totalValue: 21000000,
      averageLoanAmount: 300000,
      lastUpdated: '2024-01-01T00:00:00Z'
    }
  }
}
```

### 4. Fetch Leads by Stage
**Endpoint:** `GET /contacts/?locationId={locationId}&stage={stageName}`

**Description:** Returns leads for a specific pipeline stage.

**Response:**
```javascript
{
  success: true,
  data: [
    {
      id: 'lead-123',
      name: 'John Doe',
      email: 'john@example.com',
      // ... other lead properties
    }
  ]
}
```

## 📤 POST Endpoints

### 1. Create New Lead
**Endpoint:** `POST /contacts/?locationId={locationId}`

**Description:** Creates a new lead and assigns it to a specific pipeline stage.

**Request Body:**
```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  customField: {
    stage: 'New Lead',
    loanType: 'Conventional',
    loanAmount: 300000,
    closeDate: '2024-12-31',
    tags: ['High Priority'],
    notes: 'Initial contact made',
    status: 'On Track',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    _id: 'lead-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... other properties
  }
}
```

**Usage:**
```javascript
import { createNewLead } from '../services/pipelineApi';

const addLead = async (leadData) => {
  const response = await createNewLead({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    loanType: 'Conventional',
    loanAmount: 300000,
    closeDate: '2024-12-31',
    stage: 'New Lead',
    tags: ['High Priority'],
    notes: 'Initial contact made'
  });

  if (response.success) {
    toast.success('✅ Lead created successfully!');
    // Update UI
  } else {
    toast.error(`❌ Failed to create lead: ${response.error}`);
  }
};
```

### 2. Add Tags to Lead
**Endpoint:** `PUT /contacts/{leadId}?locationId={locationId}`

**Description:** Adds or updates tags for a specific lead.

**Request Body:**
```javascript
{
  customField: {
    tags: ['High Priority', 'VIP', 'Follow Up']
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    leadId: 'lead-123',
    tags: ['High Priority', 'VIP', 'Follow Up']
  }
}
```

**Usage:**
```javascript
import { addTagsToLead } from '../services/pipelineApi';

const updateTags = async (leadId, tags) => {
  const response = await addTagsToLead(leadId, tags);
  if (response.success) {
    toast.success('✅ Tags updated successfully!');
  }
};
```

### 3. Move Lead to Stage
**Endpoint:** `PUT /contacts/{leadId}?locationId={locationId}`

**Description:** Moves a lead from one pipeline stage to another.

**Request Body:**
```javascript
{
  customField: {
    stage: 'Contacted',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    leadId: 'lead-123',
    newStage: 'Contacted',
    oldStage: 'New Lead'
  }
}
```

**Usage:**
```javascript
import { moveLeadToStage } from '../services/pipelineApi';

const moveLead = async (leadId, newStage, oldStage) => {
  const response = await moveLeadToStage(leadId, newStage, oldStage);
  if (response.success) {
    toast.success(`✅ Lead moved to ${newStage}`);
  }
};
```

### 4. Update Lead Details
**Endpoint:** `PUT /contacts/{leadId}?locationId={locationId}`

**Description:** Updates lead information.

**Request Body:**
```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.updated@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  customField: {
    loanType: 'FHA',
    loanAmount: 350000,
    closeDate: '2024-12-31',
    status: 'On Track',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    leadId: 'lead-123',
    updates: {
      loanType: 'FHA',
      loanAmount: 350000,
      // ... other updated fields
    }
  }
}
```

## 🔄 Real-time Updates

### Setup Real-time Subscription
```javascript
import { setupRealtimeUpdates } from '../services/pipelineApi';

useEffect(() => {
  const unsubscribe = setupRealtimeUpdates((payload) => {
    console.log('🔄 Real-time update received:', payload);
    handleRealtimeUpdate(payload);
  });

  return unsubscribe;
}, []);
```

### Real-time Update Payload
```javascript
{
  eventType: 'UPDATE', // INSERT, UPDATE, DELETE
  new: {
    id: 'lead-123',
    name: 'John Doe',
    stage: 'Contacted',
    // ... other properties
  },
  old: {
    id: 'lead-123',
    stage: 'New Lead',
    // ... previous properties
  }
}
```

## 🧩 Component Integration

### EnhancedPipelineSection
Main component that orchestrates the entire pipeline:

```javascript
import EnhancedPipelineSection from './EnhancedPipelineSection';

function Dashboard() {
  return (
    <div className="p-6">
      <EnhancedPipelineSection />
    </div>
  );
}
```

### EnhancedPipelineColumn
Individual column component for each pipeline stage:

```javascript
import EnhancedPipelineColumn from './EnhancedPipelineColumn';

<EnhancedPipelineColumn
  stage={{ title: 'New Lead', color: 'bg-teal-600', icon: '👤' }}
  items={leads}
  metrics={metrics}
  onAddLead={handleAddLead}
  onUpdateLead={handleUpdateLead}
  onMoveLead={handleMoveLead}
/>
```

### EnhancedPipelineCard
Individual lead card component:

```javascript
import EnhancedPipelineCard from './EnhancedPipelineCard';

<EnhancedPipelineCard
  id="lead-123"
  name="John Doe"
  email="john@example.com"
  phone="+1234567890"
  address="123 Main St"
  loanType="Conventional"
  loanAmount={300000}
  closeDate="2024-12-31"
  status="On Track"
  tags={['High Priority', 'VIP']}
  notes="Initial contact made"
  stage="New Lead"
  onUpdate={handleUpdateLead}
  onMove={handleMoveLead}
/>
```

## 💡 Usage Examples

### Complete Pipeline Implementation
```javascript
import React, { useState, useEffect } from 'react';
import { 
  fetchPipelineLeads, 
  createNewLead, 
  addTagsToLead,
  moveLeadToStage,
  setupRealtimeUpdates 
} from '../services/pipelineApi';

function PipelineDashboard() {
  const [pipelineData, setPipelineData] = useState({
    leads: {},
    metrics: {},
    stages: []
  });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadPipelineData();
  }, []);

  // Setup real-time updates
  useEffect(() => {
    const unsubscribe = setupRealtimeUpdates(handleRealtimeUpdate);
    return unsubscribe;
  }, []);

  const loadPipelineData = async () => {
    const response = await fetchPipelineLeads();
    if (response.success) {
      setPipelineData(response.data);
    }
    setLoading(false);
  };

  const handleRealtimeUpdate = (payload) => {
    // Handle real-time updates
    console.log('Real-time update:', payload);
    // Update local state accordingly
  };

  const handleAddLead = async (leadData) => {
    const response = await createNewLead(leadData);
    if (response.success) {
      // Refresh data or update local state
      loadPipelineData();
    }
  };

  const handleUpdateTags = async (leadId, tags) => {
    const response = await addTagsToLead(leadId, tags);
    if (response.success) {
      // Update local state
    }
  };

  const handleMoveLead = async (leadId, newStage, oldStage) => {
    const response = await moveLeadToStage(leadId, newStage, oldStage);
    if (response.success) {
      // Update local state
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render pipeline components */}
    </div>
  );
}
```

### Tag Management Example
```javascript
import { fetchAvailableTags, addTagsToLead } from '../services/pipelineApi';

function TagManager({ leadId, currentTags, onTagsUpdate }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(currentTags);

  useEffect(() => {
    loadAvailableTags();
  }, []);

  const loadAvailableTags = async () => {
    const response = await fetchAvailableTags();
    if (response.success) {
      setAvailableTags(response.data);
    }
  };

  const handleTagToggle = async (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    
    const response = await addTagsToLead(leadId, newTags);
    if (response.success) {
      onTagsUpdate(newTags);
    }
  };

  return (
    <div>
      {availableTags.map(tag => (
        <button
          key={tag}
          onClick={() => handleTagToggle(tag)}
          className={`px-2 py-1 rounded ${
            selectedTags.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

## ⚠️ Error Handling

### API Error Response Format
```javascript
{
  success: false,
  error: 'Error message describing what went wrong',
  data: null
}
```

### Common Error Scenarios
1. **Network Errors**: Connection issues or API unavailability
2. **Authentication Errors**: Invalid API token or expired credentials
3. **Validation Errors**: Missing required fields or invalid data format
4. **Permission Errors**: Insufficient permissions to perform the operation

### Error Handling Best Practices
```javascript
const handleApiCall = async () => {
  try {
    const response = await fetchPipelineLeads();
    
    if (response.success) {
      // Handle success
      setData(response.data);
    } else {
      // Handle API error
      toast.error(`API Error: ${response.error}`);
      console.error('API Error:', response.error);
    }
  } catch (error) {
    // Handle network/other errors
    toast.error('Network error occurred');
    console.error('Network Error:', error);
  }
};
```

### Retry Logic
```javascript
const retryApiCall = async (apiFunction, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiFunction();
      if (response.success) {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### API Configuration
Update the API configuration in `pipelineApi.js`:

```javascript
const LEAD_CONNECTOR_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  locationId: 'your-location-id',
  token: 'your-api-token',
  version: '2021-07-28'
};
```

## 📊 Metrics Calculation

### Conversion Rates
```javascript
const conversionRates = {
  'New Lead': 12,
  'Contacted': 10,
  'Application Started': 8,
  'Pre-Approved': 5,
  'In Underwriting': 3,
  'Closed': 2
};
```

### Average Time Calculation
```javascript
const calculateAverageTime = (leads) => {
  if (leads.length === 0) return '0:00';
  
  // Calculate based on createdAt and updatedAt timestamps
  const totalTime = leads.reduce((sum, lead) => {
    const created = new Date(lead.createdAt);
    const updated = new Date(lead.updatedAt);
    return sum + (updated - created);
  }, 0);
  
  const avgMinutes = Math.floor(totalTime / leads.length / (1000 * 60));
  const hours = Math.floor(avgMinutes / 60);
  const minutes = avgMinutes % 60;
  
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};
```

## 🚀 Performance Optimization

### Debounced Saves
```javascript
const debounceTimer = useRef(null);

useEffect(() => {
  if (editingField && editedValue) {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => handleSave(), 1500);
  }
}, [editedValue]);
```

### Real-time Update Optimization
```javascript
const handleRealtimeUpdate = useCallback((payload) => {
  setPipelineData(prevData => {
    // Optimize updates by only updating changed data
    const newData = { ...prevData };
    // ... update logic
    return newData;
  });
}, []);
```

This comprehensive API service provides everything needed to build a robust pipeline management system with real-time updates, tag management, and detailed metrics tracking. 