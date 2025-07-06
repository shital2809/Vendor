
import React, { useState } from 'react';

const SalesReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const getCircleStyle = () => {
    return selectedPeriod === 'Today'
      ? 'border-4 border-gray-400 text-black'
      : 'border-4 border-gray-300 text-gray-500';
  };

  return (
    <div className="p-4 lg:w-[60rem] lg:ml-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold">Sales Report</h2>
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full appearance-none bg-white rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['SALES', 'BOOKINGS', 'REVENUE'].map((title) => (
            <div key={title} className="text-center">
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto rounded-full flex items-center justify-center ${getCircleStyle()}`}
              >
                <span className="text-sm sm:text-base">No Data</span>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default SalesReport;

