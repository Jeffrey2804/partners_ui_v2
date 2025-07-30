import { createContext, useEffect, useState } from 'react';

export const PipelineContext = createContext();

const initialStages = [
  'Application Received',
  'Pre-Approval Issued',
  'In Processing',
  'Submitted to Underwriting',
  'Conditional Approval',
  'Docs Out / Scheduled to Close',
  'Post-Close Follow-Up',
];

const categorizeLeads = (leads) => {
  const result = {};
  initialStages.forEach((stage) => {
    result[stage] = [];
  });
  leads.forEach((lead) => {
    const stage = lead.stage || initialStages[0];
    if (!result[stage]) result[stage] = [];
    result[stage].push(lead);
  });
  return result;
};

const fetchAndTransformLeads = async () => {
  try {
    const response = await fetch(
      'https://services.leadconnectorhq.com/contacts/?locationId=b7vHWUGVUNQGoIlAXabY',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer 123',
          Version: '2021-07-28',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // If the API returns an array of contacts, use it directly. Adjust if the structure is different.
    const leads = data.contacts || data || [];
    return categorizeLeads(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    const empty = {};
    initialStages.forEach((stage) => (empty[stage] = []));
    return empty;
  }
};

export const PipelineProvider = ({ children }) => {
  const [leadsByStage, setLeadsByStage] = useState(null);

  useEffect(() => {
    fetchAndTransformLeads().then(setLeadsByStage);
  }, []);

  // The following functions are placeholders since we can't mutate the remote API
  const addLead = async () => { throw new Error('Not implemented'); };
  const updateLead = async () => { throw new Error('Not implemented'); };
  const deleteLead = async () => { throw new Error('Not implemented'); };
  const moveLeadToStage = () => { throw new Error('Not implemented'); };

  return (
    <PipelineContext.Provider
      value={{
        leadsByStage,
        setLeadsByStage,
        addLead,
        updateLead,
        deleteLead,
        moveLeadToStage,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}; 