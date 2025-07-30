import React from 'react';
import Header from '../Header';
import PipelineSection from '../pipeline/PipelineSection';
import TaskManagementSection from './TaskManagementSection';
import TaskColumn from './TaskColumn';
import DocumentChecklist from './DocumentChecklist';
import NotificationSection from './NotificationSection';
import CommunicationLog from './CommunicationLog';
import QuickStats from './QuickStats';
import Breadcrumb from '../Breadcrumb';
import { PipelineProvider } from '../../context/PipelineContext';

const AdminDashboard = () => {
  const taskColumns = [
    { title: 'Due today', color: 'red', items: [1, 2, 3] },
    { title: 'Follow-up', color: 'yellow', items: [1, 2] },
    { title: 'Pending', color: 'green', items: [1, 2] },
  ];

  const documentList = [
    { status: 'REQUIRED', name: 'Document 1', date: '06/01/2024' },
    { status: 'REQUIRED', name: 'Document 2', date: '06/03/2024' },
    { status: 'RECEIVED', name: 'Document 3', date: '06/05/2024', checked: true },
    { status: 'PENDING', name: 'Document 4', date: '06/10/2024' },
  ];

  return (
    <PipelineProvider>
      <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-all overflow-auto">
        <Header />

        <main className="px-6 py-10 space-y-10 w-full h-full">
          {/* ✅ Replaced Breadcrumb */}
          <Breadcrumb path={['Admin', 'Dashboard']} />

          {/* Loan Pipeline */}
          <Section>
            <PipelineSection isAdmin={true} />
          </Section>

          {/* Task Management */}
          <Section>
            <TaskManagementSection />
          </Section>

          {/* Task Status + Document Checklist */}
          <Section title="📌 Task Status & Documentation">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="flex flex-row gap-4 overflow-x-auto w-full lg:w-2/3">
                {taskColumns.map((col, i) => (
                  <TaskColumn key={i} {...col} />
                ))}
              </div>
              <div className="w-full lg:w-1/3">
                <DocumentChecklist documents={documentList} />
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <NotificationSection />

          {/* Communication + Quick Stats */}
          <Section>
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="flex-1">
                <CommunicationLog />
              </div>
              <div className="w-full lg:w-1/3">
                <QuickStats />
              </div>
            </div>
          </Section>
        </main>
      </div>
    </PipelineProvider>
  );
};

const Section = ({ title, children }) => (
  <section className="pt-10 border-t border-gray-200 dark:border-gray-700 w-full">
    {title && <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">{title}</h2>}
    {children}
  </section>
);

export default AdminDashboard;
