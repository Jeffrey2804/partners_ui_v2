# Pipeline Management Components

This document explains how to use the enhanced pipeline management components with full CRUD functionality, similar to the TaskContext pattern.

## Overview

The pipeline system consists of three main components:
- **PipelineContext**: Manages state and API calls for leads
- **PipelineSection**: Displays the pipeline stages in a grid layout
- **PipelineCard**: Individual cards for each pipeline stage
- **LeadModal**: Modal for creating/editing leads

## Components

### 1. PipelineContext (`src/context/PipelineContext.jsx`)

The context provides state management and API integration for pipeline leads.

#### Features:
- **GET**: Fetches leads from the API and categorizes them by stage
- **POST**: Creates new leads
- **PUT**: Updates existing leads
- **DELETE**: Removes leads
- **State Management**: Manages loading states, errors, and data

#### Usage:
```jsx
import { PipelineProvider, PipelineContext } from './context/PipelineContext';

// Wrap your app
function App() {
  return (
    <PipelineProvider>
      <YourComponents />
    </PipelineProvider>
  );
}

// Use in components
function MyComponent() {
  const { 
    leadsByStage, 
    loading, 
    error, 
    addLead, 
    updateLead, 
    deleteLead,
    moveLeadToStage,
    refreshLeads 
  } = useContext(PipelineContext);
}
```

#### API Endpoints:
- **GET**: `https://services.leadconnectorhq.com/contacts/?locationId=b7vHWUGVUNQGoIlAXabY`
- **POST**: `https://services.leadconnectorhq.com/contacts/?locationId=b7vHWUGVUNQGoIlAXabY`
- **PUT**: `https://services.leadconnectorhq.com/contacts/{leadId}?locationId=b7vHWUGVUNQGoIlAXabY`
- **DELETE**: `https://services.leadconnectorhq.com/contacts/{leadId}?locationId=b7vHWUGVUNQGoIlAXabY`

### 2. PipelineSection (`src/component/PipelineSection.jsx`)

Displays all pipeline stages in a responsive grid layout with drag-and-drop functionality.

#### Features:
- Responsive grid layout
- Drag-and-drop reordering
- Stage filtering
- Loading and error states
- Modal for detailed view

#### Usage:
```jsx
import PipelineSection from './component/PipelineSection';

function Dashboard() {
  return (
    <div>
      <PipelineSection />
    </div>
  );
}
```

### 3. PipelineCard (`src/component/PipelineCard.jsx`)

Individual cards for each pipeline stage showing leads and progress.

#### Features:
- Collapsible content
- Progress bars
- Lead details display
- Edit functionality
- Status indicators

#### Props:
```jsx
<PipelineCard
  id="stage-id"
  title="Stage Name"
  color="teal"
  leads={[]}
  listeners={dragListeners}
  attributes={dragAttributes}
  setNodeRef={setNodeRef}
  isDragging={false}
  onClick={() => {}}
/>
```

### 4. LeadModal (`src/component/LeadModal.jsx`)

Modal for creating and editing leads with comprehensive form fields.

#### Features:
- Form validation
- Drag-and-drop modal
- Stage selection
- Tag management
- Notes field

#### Usage:
```jsx
import LeadModal from './component/LeadModal';

function AddLeadButton() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Lead</button>
      {showModal && (
        <LeadModal
          lead={{}}
          onClose={() => setShowModal(false)}
          onSave={(leadData) => {
            // Handle save
            setShowModal(false);
          }}
          stageSelector={<select>...</select>}
        />
      )}
    </>
  );
}
```

## Data Structure

### Lead Object:
```javascript
{
  id: "unique-id",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: "123 Main St",
  loanType: "Conventional", // FHA, VA, USDA, Jumbo
  loanAmount: 300000,
  closeDate: "2024-12-31",
  status: "On Track", // On Track, Pending, Delayed, Closed
  tags: ["High Priority", "VIP"],
  notes: "Additional notes",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

### Pipeline Stages:
```javascript
const initialStages = [
  'Application Received',
  'Pre-Approval Issued',
  'In Processing',
  'Submitted to Underwriting',
  'Conditional Approval',
  'Docs Out / Scheduled to Close',
  'Post-Close Follow-Up'
];
```

## Complete Example

```jsx
import { useContext, useState } from 'react';
import { PipelineContext } from './context/PipelineContext';
import PipelineSection from './component/PipelineSection';
import LeadModal from './component/LeadModal';

function PipelineDashboard() {
  const { addLead, initialStages } = useContext(PipelineContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(initialStages[0]);

  const handleAddLead = async (leadData) => {
    try {
      await addLead(selectedStage, leadData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pipeline Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Lead
        </button>
      </div>

      <PipelineSection />

      {showAddModal && (
        <LeadModal
          lead={{}}
          onClose={() => setShowModal(false)}
          onSave={handleAddLead}
          stageSelector={
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              {initialStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          }
        />
      )}
    </div>
  );
}
```

## API Integration

The components use the LeadConnector API with the following authentication:
- **Authorization**: `Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f`
- **Version**: `2021-07-28`
- **Location ID**: `b7vHWUGVUNQGoIlAXabY`

### Error Handling

The context includes comprehensive error handling:
- Network errors
- API errors
- Validation errors
- Loading states

### State Management

The context manages:
- `leadsByStage`: Leads organized by pipeline stage
- `loading`: Loading state for API calls
- `error`: Error messages
- `initialStages`: Available pipeline stages

## Styling

All components use Tailwind CSS classes and are fully responsive. The design follows the existing dashboard theme with:
- Dark mode support
- Consistent color scheme (`#01818E` primary color)
- Smooth animations and transitions
- Hover effects and interactions

## Dependencies

Required dependencies:
- `react`
- `framer-motion` (for animations)
- `@dnd-kit/core` and `@dnd-kit/sortable` (for drag-and-drop)
- `react-hot-toast` (for notifications)
- `react-draggable` (for modal dragging)

## Migration from Old Components

If you're migrating from the old pipeline components:

1. Replace the old context with `PipelineContext`
2. Update component imports to use the new structure
3. Update any hardcoded data to use the API integration
4. Add error handling for API calls
5. Update any custom styling to match the new design

The new components maintain backward compatibility while adding full CRUD functionality and better error handling. 