import React from 'react';
import Header from '../component/Header';
import PartnerLeadsTable from '../component/partnership/PartnerLeadsTable';
import LeadConversionFunnel from '../component/partnership/LeadConversionFunnel';
import PartnerDashboardInsights from '../component/partnership/PartnerDashboardInsights';
import PartnerOverviewTable from '../component/partnership/PartnerOverviewTable';
import CTRAnalyticsChart from '../component/partnership/CTRAnalyticsChart';

const PartnerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* ✅ Top Navigation */}
      <Header />

      {/* ✅ Main Content */}
      <main className="w-full px-6 py-10 space-y-10">
      
        {/* ✅ Section: Lead Generation */}
        <section className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <PartnerLeadsTable />
        </section>

        {/* ✅ Section: Lead Conversion Funnel */}
        <section className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <LeadConversionFunnel />
        </section>

        {/* ✅ Section: Campaigns, Tasks, Integration Summary */}
        <section className="w-full rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-0">
          <PartnerDashboardInsights />
        </section>

        {/* ✅ Section: Overview Metrics */}
        <section className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <PartnerOverviewTable />
        </section>

        {/* ✅ Section: CTR Analytics */}
        <section className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <CTRAnalyticsChart />
        </section>
      </main>
    </div>
  );
};

export default PartnerDashboardPage;
