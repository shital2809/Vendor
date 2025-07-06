
// import { useState } from "react";
// import { FaPlaneDeparture, FaHotel, FaTrain, FaCar } from "react-icons/fa";
// import { BsBuilding } from "react-icons/bs";
// import FlightSearchForm from "./FlightSearchForm";

// export default function FlightSearchCard() {
//   const [activeTab, setActiveTab] = useState("Flights");

//   const tabs = [
//     { name: "Flights", icon: <FaPlaneDeparture /> },
//     { name: "Hotels", icon: <FaHotel /> },
//     { name: "Room blocks", icon: <BsBuilding /> },
//     { name: "Trains", icon: <FaTrain /> },
//     { name: "Rental cars", icon: <FaCar /> },
//   ];

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 bg-white shadow-lg rounded-lg">
//       {/* Tabs */}
//       <div className="flex flex-wrap gap-2 lg:gap-4 border-b pb-2 mb-4 overflow-x-auto">
//         {tabs.map((tab) => (
//           <div
//             key={tab.name}
//             onClick={() => setActiveTab(tab.name)}
//             className={`flex items-center space-x-2 cursor-pointer pb-1 text-sm lg:text-base ${
//               activeTab === tab.name
//                 ? "text-purple-600 font-semibold border-b-2 border-purple-600"
//                 : "text-gray-500 hover:text-purple-600"
//             }`}
//           >
//             {tab.icon}
//             <span>{tab.name}</span>
//           </div>
//         ))}
//       </div>

//       {/* Conditionally Render Forms Based on Active Tab */}
//       {activeTab === "Flights" && <FlightSearchForm />}
//       {activeTab === "Hotels" && (
//         <div className="p-4">
//           <h3 className="text-lg font-semibold">Hotel Search Form</h3>
//           <p>Placeholder for Hotel Search Form (to be implemented).</p>
//         </div>
//       )}
//       {activeTab === "Room blocks" && (
//         <div className="p-4">
//           <h3 className="text-lg font-semibold">Room Blocks Form</h3>
//           <p>Placeholder for Room Blocks Form (to be implemented).</p>
//         </div>
//       )}
//       {activeTab === "Trains" && (
//         <div className="p-4">
//           <h3 className="text-lg font-semibold">Train Search Form</h3>
//           <p>Placeholder for Train Search Form (to be implemented).</p>
//         </div>
//       )}
//       {activeTab === "Rental cars" && (
//         <div className="p-4">
//           <h3 className="text-lg font-semibold">Rental Cars Form</h3>
//           <p>Placeholder for Rental Cars Form (to be implemented).</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { FaPlaneDeparture, FaHotel, FaTrain, FaCar } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import FlightSearchForm from "./FlightSearchForm";

export default function FlightSearchCard({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "Flights", icon: <FaPlaneDeparture /> },
    { name: "Hotels", icon: <FaHotel /> },
    { name: "Room blocks", icon: <BsBuilding /> },
    { name: "Trains", icon: <FaTrain /> },
    { name: "Rental cars", icon: <FaCar /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 bg-white shadow-lg rounded-lg">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 lg:gap-4 border-b pb-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center space-x-2 cursor-pointer pb-1 text-sm lg:text-base ${
              activeTab === tab.name
                ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </div>
        ))}
      </div>

      {/* Conditionally Render Forms Based on Active Tab */}
      {activeTab === "Flights" && <FlightSearchForm />}
      {activeTab === "Hotels" && (
        <div className="p-4">
          <h3 className="text-lg font-semibold">Hotel Search Form</h3>
          <p>Placeholder for Hotel Search Form (to be implemented).</p>
        </div>
      )}
      {activeTab === "Room blocks" && (
        <div className="p-4">
          <h3 className="text-lg font-semibold">Room Blocks Form</h3>
          <p>Placeholder for Room Blocks Form (to be implemented).</p>
        </div>
      )}
      {activeTab === "Trains" && (
        <div className="p-4">
          <h3 className="text-lg font-semibold">Train Search Form</h3>
          <p>Placeholder for Train Search Form (to be implemented).</p>
        </div>
      )}
      {activeTab === "Rental cars" && (
        <div className="p-4">
          <h3 className="text-lg font-semibold">Rental Cars Form</h3>
          <p>Placeholder for Rental Cars Form (to be implemented).</p>
        </div>
      )}
    </div>
  );
}
