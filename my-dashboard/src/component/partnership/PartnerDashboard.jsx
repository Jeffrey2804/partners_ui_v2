import React from 'react';
import Header from '../component/Header';
import PartnerOverviewTable from '../component/partnership/PartnerOverviewTable';
import PartnerLeadsTable from '../component/partnership/PartnerLeadsTable';
import LeadConversionFunnel from '../component/partnership/LeadConversionFunnel';
import PartnerDashboardInsights from '../component/partnership/PartnerDashboardInsights';

const PartnerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* ✅ Top Navigation */}
      <Header />

      {/* ✅ Page Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">📊 Partner Dashboard</h1>

        {/* ✅ Partner Leads Table */}
        <section className="rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Generation</h2>
          <PartnerLeadsTable />
        </section>

        {/* ✅ Funnel */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <LeadConversionFunnel />
        </section>

        {/* ✅ Campaigns / Tasks / Integration */}
        <section className="rounded-xl shadow p-0">
          <PartnerDashboardInsights />
        </section>

        {/* ✅ Overview Section */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-6">
          <PartnerOverviewTable />
        </section>
      </main>
    </div>
  );
};

export default PartnerDashboardPage;
