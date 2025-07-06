
import React, { useState } from 'react';

const TopAirlines = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');
  const [activeTab, setActiveTab] = useState('All');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const getCircleStyle = () => {
    return selectedPeriod === 'Today'
      ? 'border-4 border-gray-400 text-black'
      : 'border-4 border-gray-300 text-gray-500';
  };

  const tabs = ['All', 'Domestic', 'International'];

  return (
    <div className="px-4 py-6 w-full lg:w-[60rem] lg:ml-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
        {/* Tabs and Dropdown */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'text-black border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Period Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full sm:w-auto appearance-none rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-gray-300 h-0.5 w-full mb-6"></div>

        {/* Circle Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Sales', 'Bookings', 'Revenue'].map((title) => (
            <div key={title} className="text-center">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto rounded-full flex items-center justify-center ${getCircleStyle()}`}
              >
                <div className="text-center">
                  <p className="font-bold text-base">{title}</p>
                  <p className="text-sm">No Data</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAirlines;
