// import React, { useState } from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from 'recharts';

// const data = Array.from({ length: 30 }, (_, i) => ({
//   day: (i + 1).toString().padStart(2, '0'),
//   value: 0,
// }));

// const MonthlySales = () => {
//   const [activeTab, setActiveTab] = useState('sales');
//   const [selectedMonth, setSelectedMonth] = useState('APRIL');

//   const tabs = [
//     { label: 'Monthly Sales', key: 'sales' },
//     { label: 'Monthly Revenue', key: 'revenue' },
//   ];

//   return (
//     <div className="p-4 lg:w-[60rem] lg:ml-6">
//       {/* Tabs */}
//       <div className=' bg-white p-6 rounded-lg shadow-md w-full'>
//       <div className="flex space-x-4 border-b border-gray-200 mb-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`py-2 font-medium ${
//               activeTab === tab.key
//                 ? 'border-b-2 border-yellow-500 text-black'
//                 : 'text-gray-500'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>
     
//       {/* Header and Month Dropdown */}
//       <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
//         <h2 className="text-lg font-semibold">
//           Your {activeTab === 'sales' ? 'Monthly Sales' : 'Monthly Revenue'} ₹0
//         </h2>
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border border-gray-300 rounded-md py-1 px-3"
//         >
//           {['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE'].map((month) => (
//             <option key={month} value={month}>
//               {month}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} />
//           <XAxis dataKey="day" />
//           <YAxis domain={[0, 1]} />
//           <Tooltip />
//           <Line type="monotone" dataKey="value" stroke="#FFB703" strokeWidth={2} dot={false} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//     </div>
//   );
// };

// export default MonthlySales;
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = Array.from({ length: 30 }, (_, i) => ({
  day: (i + 1).toString().padStart(2, '0'),
  value: 0,
}));

const MonthlySales = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedMonth, setSelectedMonth] = useState('APRIL');

  const tabs = [
    { label: 'Monthly Sales', key: 'sales' },
    { label: 'Monthly Revenue', key: 'revenue' },
  ];

  return (
    <div className="p-4 lg:w-[60rem] lg:ml-6">
       <div className="bg-white p-6 rounded-lg shadow-md w-full">
    {/*
        <div className="flex space-x-6 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-semibold ${
                activeTab === tab.key
                  ? 'border-b-4 border-yellow-400 text-black'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* === Chart Header with Month Dropdown === */}
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2 ">
          <h2 className="text-lg font-semibold">
            Your {activeTab === 'sales' ? 'Monthly Sales' : 'Monthly Revenue'} ₹0
          </h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-3"
          >
            {['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE'].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* === Line Chart === */}
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFB703"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
     </div>
  );
};

export default MonthlySales;
