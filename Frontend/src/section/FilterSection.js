



// // FilterSection.jsx
// import React, { useState, useEffect } from "react";

// const FilterSection = ({ isOpen, onClose, flights, onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState(25000); // Default price range
//   const [stops, setStops] = useState({ nonStop: false, oneStop: false, twoPlusStops: false });
//   const [airlines, setAirlines] = useState({});
//   const [departureTimes, setDepartureTimes] = useState({
//     morning: false,
//     afternoon: false,
//     evening: false,
//   });
//   const [arrivalTimes, setArrivalTimes] = useState({
//     morning: false,
//     afternoon: false,
//     evening: false,
//   });

//   useEffect(() => {
//     const uniqueAirlines = [...new Set(flights.flatMap((flight) => flight.validatingAirlineCodes))];
//     const initialAirlines = uniqueAirlines.reduce((acc, code) => ({ ...acc, [code]: false }), {});
//     setAirlines(initialAirlines);
//   }, [flights]);

//   useEffect(() => {
//     const filterCriteria = {
//       priceRange,
//       stops: Object.keys(stops).filter((key) => stops[key]),
//       airlines: Object.keys(airlines).filter((key) => airlines[key]),
//       departureTimes: Object.keys(departureTimes).filter((key) => departureTimes[key]),
//       arrivalTimes: Object.keys(arrivalTimes).filter((key) => arrivalTimes[key]),
//     };
//     onFilterChange(filterCriteria);
//   }, [priceRange, stops, airlines, departureTimes, arrivalTimes, onFilterChange]);

//   const handleStopsChange = (key) => {
//     setStops((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleAirlinesChange = (code) => {
//     setAirlines((prev) => ({ ...prev, [code]: !prev[code] }));
//   };

//   const handleDepartureTimeChange = (key) => {
//     setDepartureTimes((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleArrivalTimeChange = (key) => {
//     setArrivalTimes((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   return (
//     <div
//       className={`${
//         isOpen ? "block" : "hidden"
//       } lg:block w-full lg:w-auto bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 fixed lg:sticky top-0 left-0 h-full lg:h-auto max-h-[calc(100vh-9rem)] overflow-y-auto z-[1500] transition-all duration-300`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg sm:text-xl font-bold text-indigo-800">Filters</h2>
//         <button className="lg:hidden text-gray-600 hover:text-gray-800 text-xl" onClick={onClose}>
//           ✕
//         </button>
//       </div>

//       {/* Price Range Filter */}
//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
//         <input
//           type="range"
//           min="0"
//           max="500"
//           step="10"
//           value={priceRange}
//           onChange={(e) => setPriceRange(Number(e.target.value))}
//           className="w-full accent-indigo-600"
//         />
//         <div className="flex justify-between text-sm text-gray-600 mt-1">
//           <span>€0</span>
//           <span>€{priceRange.toLocaleString("en-US")}</span>
//         </div>
//       </div>

//       {/* Stops Filter */}
//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Stops</h3>
//         {["nonStop", "oneStop", "twoPlusStops"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={stops[key]}
//               onChange={() => handleStopsChange(key)}
//               className="mr-2 accent-indigo-600 h-4 w-4"
//             />
//             <span className="text-sm text-gray-600">
//               {key === "nonStop" ? "Non-stop" : key === "oneStop" ? "1 Stop" : "2+ Stops"}
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Airlines Filter */}
//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Airlines</h3>
//         {Object.keys(airlines).map((code) => (
//           <label key={code} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={airlines[code]}
//               onChange={() => handleAirlinesChange(code)}
//               className="mr-2 accent-indigo-600 h-4 w-4"
//             />
//             <span className="text-sm text-gray-600">{code}</span>
//           </label>
//         ))}
//       </div>

//       {/* Departure Time Filter */}
//       <div className="mb-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Departure Time</h3>
//         {["morning", "afternoon", "evening"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={departureTimes[key]}
//               onChange={() => handleDepartureTimeChange(key)}
//               className="mr-2 accent-indigo-600 h-4 w-4"
//             />
//             <span className="text-sm text-gray-600">
//               {key.charAt(0).toUpperCase() + key.slice(1)} (
//               {key === "morning" ? "6 AM - 12 PM" : key === "afternoon" ? "12 PM - 6 PM" : "6 PM - 12 AM"})
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Arrival Time Filter */}
//       <div>
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Arrival Time</h3>
//         {["morning", "afternoon", "evening"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={arrivalTimes[key]}
//               onChange={() => handleArrivalTimeChange(key)}
//               className="mr-2 accent-indigo-600 h-4 w-4"
//             />
//             <span className="text-sm text-gray-600">
//               {key.charAt(0).toUpperCase() + key.slice(1)} (
//               {key === "morning" ? "6 AM - 12 PM" : key === "afternoon" ? "12 PM - 6 PM" : "6 PM - 12 AM"})
//             </span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;
//.....................................................................................................................................



import React, { useState, useEffect } from "react";

const FilterSection = ({ isOpen, onClose, flights, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(25000); // Default price range
  const [stops, setStops] = useState({ nonStop: false, oneStop: false, twoPlusStops: false });
  const [airlines, setAirlines] = useState({});
  const [departureTimes, setDepartureTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  });
  const [arrivalTimes, setArrivalTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  });

  useEffect(() => {
    const uniqueAirlines = [...new Set(flights.flatMap((flight) => flight.validatingAirlineCodes))];
    const initialAirlines = uniqueAirlines.reduce((acc, code) => ({ ...acc, [code]: false }), {});
    setAirlines(initialAirlines);
  }, [flights]);

  // Debounce filter changes to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      const filterCriteria = {
        priceRange,
        stops: Object.keys(stops).filter((key) => stops[key]),
        airlines: Object.keys(airlines).filter((key) => airlines[key]),
        departureTimes: Object.keys(departureTimes).filter((key) => departureTimes[key]),
        arrivalTimes: Object.keys(arrivalTimes).filter((key) => arrivalTimes[key]),
      };
      onFilterChange(filterCriteria);
    }, 100); // Delay of 100ms to debounce
    return () => clearTimeout(timer);
  }, [priceRange, stops, airlines, departureTimes, arrivalTimes, onFilterChange]);

  const handleStopsChange = (key) => {
    setStops((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAirlinesChange = (code) => {
    setAirlines((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleDepartureTimeChange = (key) => {
    setDepartureTimes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleArrivalTimeChange = (key) => {
    setArrivalTimes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } lg:block w-full lg:w-auto bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 fixed lg:sticky top-0 left-0 h-full lg:h-auto max-h-[calc(100vh-9rem)] overflow-y-auto z-[1500] transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-indigo-800">Filters</h2>
        <button className="lg:hidden text-gray-600 hover:text-gray-800 text-xl" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>€0</span>
          <span>€{priceRange.toLocaleString("en-US")}</span>
        </div>
      </div>

      {/* Stops Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Stops</h3>
        {["nonStop", "oneStop", "twoPlusStops"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={stops[key]}
              onChange={() => handleStopsChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4"
            />
            <span className="text-sm text-gray-600">
              {key === "nonStop" ? "Non-stop" : key === "oneStop" ? "1 Stop" : "2+ Stops"}
            </span>
          </label>
        ))}
      </div>

      {/* Airlines Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Airlines</h3>
        {Object.keys(airlines).map((code) => (
          <label key={code} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={airlines[code]}
              onChange={() => handleAirlinesChange(code)}
              className="mr-2 accent-indigo-600 h-4 w-4"
            />
            <span className="text-sm text-gray-600">{code}</span>
          </label>
        ))}
      </div>

      {/* Departure Time Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Departure Time</h3>
        {["morning", "afternoon", "evening"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={departureTimes[key]}
              onChange={() => handleDepartureTimeChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4"
            />
            <span className="text-sm text-gray-600">
              {key.charAt(0).toUpperCase() + key.slice(1)} (
              {key === "morning" ? "6 AM - 12 PM" : key === "afternoon" ? "12 PM - 6 PM" : "6 PM - 12 AM"})
            </span>
          </label>
        ))}
      </div>

      {/* Arrival Time Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Arrival Time</h3>
        {["morning", "afternoon", "evening"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={arrivalTimes[key]}
              onChange={() => handleArrivalTimeChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4"
            />
            <span className="text-sm text-gray-600">
              {key.charAt(0).toUpperCase() + key.slice(1)} (
              {key === "morning" ? "6 AM - 12 PM" : key === "afternoon" ? "12 PM - 6 PM" : "6 PM - 12 AM"})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;