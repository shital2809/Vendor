// import React, { useState } from 'react';

// const TopSectors = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');

//   const handlePeriodChange = (period) => {
//     setSelectedPeriod(period);
//   };

//   return (
//     <div className="p-4 lg:w-[60rem] lg:ml-6">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="relative">
           
//           </div>

//           {/* Period Dropdown */}
//           <div className="relative">
//             <select
//               value={selectedPeriod}
//               onChange={(e) => handlePeriodChange(e.target.value)}
//               className="appearance-none bg-white rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500"
//             >
//               <option value="Today">Today</option>
//               <option value="Yesterday">Yesterday</option>
//               <option value="Last 7 Days">Last 7 Days</option>
//               <option value="Last 30 Days">Last 30 Days</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
//                 <path d="M10 12l-5-5h10l-5 5z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Chart Circle */}
//         <div className="flex justify-center">
//           <div className="w-40 h-40 rounded-full border-4 border-gray-300 flex items-center justify-center text-center">
//             <span className="text-sm">No Data</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopSectors;

import React, { useState } from 'react';

const TopSectors = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="p-4 lg:w-[60rem] lg:ml-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        {/* === Heading === */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold relative inline-block">
      
          </h2>

          {/* === Period Dropdown === */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-yellow-500"
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

        {/* === Chart Placeholder === */}
        <div className="flex justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-gray-300 flex items-center justify-center text-center">
            <span className="text-sm font-medium">No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSectors;
