import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

const CommunicationLog = () => {
  const tabs = ['Borrower Updates', 'Processor Feedback', 'Agent updates', 'Messages'];
  const loanTabs = ['Loan Type 1', 'Loan Type 2', 'Loan Type 3', 'Loan Type 4'];

  const [activeTab, setActiveTab] = useState('Borrower Updates');
  const [activeLoanTab, setActiveLoanTab] = useState('Loan Type 1');

  const logUsers = [
    { name: 'Althea Burnett', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Daniel Peters', avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
  ];

  const handoffUsers = [
    { name: 'Leo Martinez', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Susan Lawrence', avatar: 'https://randomuser.me/api/portraits/women/49.jpg' },
  ];

  const accentColor = '#01818E';

  return (
    <section className="space-y-16 py-10 text-sm">
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="whatsapp" className="w-6 h-6" />
          Communication Log
        </h2>

        <div className="flex gap-6 font-semibold border-b border-[#01818E] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition-all ${
                tab === activeTab
                  ? 'border-b-2'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              style={{
                color: tab === activeTab ? accentColor : undefined,
                borderColor: tab === activeTab ? accentColor : undefined,
              }}
            >
              {tab}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#C6F5F8] text-black">
                {10 + tabs.indexOf(tab) * 2}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-white text-black border-[#01818E] focus:ring-2 focus:ring-[#01818E] focus:outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#01818E]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md transition font-medium bg-[#C6F5F8] text-black hover:bg-[#b2eaf0]">
            <FaFilter style={{ color: accentColor }} />
            <span style={{ color: accentColor }}>Filter</span>
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden shadow">
          <div className="grid grid-cols-3 px-6 py-3 text-xs font-bold uppercase tracking-wide border-b border-[#01818E] bg-gray-200">
            <span className="text-black">Name</span>
            <span className="text-black">Date</span>
            <span className="text-black">Message</span>
          </div>
          <div className="divide-y divide-gray-300">
            {logUsers.map((user, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 px-6 py-4 items-center text-black hover:bg-[#C6F5F8]"
              >
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <a href="#" className="hover:underline font-medium" style={{ color: accentColor }}>
                    {user.name}
                  </a>
                </div>
                <span className="text-sm text-gray-400">MM/DD/YYYY</span>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="handoff" className="w-6 h-6" />
          Collaboration & Handoff
        </h2>

        <div className="flex gap-6 font-semibold border-b border-[#01818E] mb-6">
          {loanTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveLoanTab(tab)}
              className={`pb-2 transition-all ${
                tab === activeLoanTab
                  ? 'border-b-2'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              style={{
                color: tab === activeLoanTab ? accentColor : undefined,
                borderColor: tab === activeLoanTab ? accentColor : undefined,
              }}
            >
              {tab}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#C6F5F8] text-black">
                {10 + loanTabs.indexOf(tab) * 2}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-white text-black border-[#01818E] focus:ring-2 focus:ring-[#01818E] focus:outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#01818E]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md transition font-medium bg-[#C6F5F8] text-black hover:bg-[#b2eaf0]">
            <FaFilter style={{ color: accentColor }} />
            <span style={{ color: accentColor }}>Filter</span>
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden shadow">
          <div className="grid grid-cols-3 px-6 py-3 text-xs font-bold uppercase tracking-wide border-b border-[#01818E] bg-gray-200">
            <span className="text-black">Point of Contact</span>
            <span className="text-black">Progress</span>
            <span className="text-black">Updates</span>
          </div>
          <div className="divide-y divide-gray-300">
            {handoffUsers.map((user, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 px-6 py-4 items-center text-black hover:bg-[#C6F5F8]"
              >
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-white bg-rose-500 px-4 py-1 rounded-full shadow">
                    MARK READY FOR NEXT STAGE
                  </span>
                </div>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationLog;
