import Header from './Header';
import MarketingSection from './MarketingSection';
import PipelineSection from './PipelineSection';
import CampaignSection from './CampaignSection';
import TaskSection from './TaskSection';
import CalendarSection from './CalendarSection';

const Dashboard = () => (
  <div className="w-full min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 text-base md:text-lg">
    <Header />

    <main className="flex flex-col gap-4 px-4 sm:px-6 md:px-10 lg:px-20">

      {/* Pipeline Section */}
      <PipelineSection />

      {/* Marketing Section — minimal gap */}
      <section className="px-4 sm:px-6 md:px-0 pt-1">
        <MarketingSection />
      </section>

      {/* Campaigns */}
      <section className="px-4 sm:px-6 md:px-0 pt-6">
        <CampaignSection />
      </section>

      {/* Tasks */}
      <section className="px-4 sm:px-6 md:px-0 pt-6">
        <TaskSection />
      </section>

      {/* Calendar */}
      <section className="px-4 sm:px-6 md:px-0 pt-6 pb-10">
        <CalendarSection />
      </section>
    </main>
  </div>
);

export default Dashboard;
