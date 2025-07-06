
// import React from "react";

// const Sidebardash = ({ activeTab, setActiveTab }) => {
//   const sidebarItems = [
//     "Itineraries",
//     "Return Ticket Itinerary",
//     "View Cancellations",
//     "Travel Calendar",
//     "Re-Issue Itinerary",
//     "IRCTC Refund Pending",
//     "Rail Request",
//     "Rail Rebook",
//   ];
 

//   return (
//     <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3 w-full md:w-64">
//       {sidebarItems.map((item, idx) => (
//         <div
//           key={idx}
//           onClick={() => setActiveTab(item)}
//           className={`flex justify-between items-center text-sm font-medium border-b pb-2 cursor-pointer ${
//             activeTab === item
//               ? "text-blue-600 border-l-4 border-blue-600 pl-2 bg-blue-50"
//               : "hover:bg-gray-100"
//           }`}
//         >
//           <span>{item}</span>
//           {(item === "Re-Issue Itinerary" || item === "Rail Rebook") && (
//             <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
//               New
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Sidebardash;

import React from "react";

const Sidebardash = ({ activeTab, setActiveTab, sidebarItems }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3 w-full md:w-64">
      {sidebarItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => setActiveTab(item)}
          className={`flex justify-between items-center text-sm font-medium border-b pb-2 cursor-pointer ${
            activeTab === item
              ? "text-blue-600 border-l-4 border-blue-600 pl-2 bg-blue-50"
              : "hover:bg-gray-100"
          }`}
        >
          <span>{item}</span>
          {(item === "Re-Issue Itinerary" || item === "Rail Rebook") && (
            <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebardash;