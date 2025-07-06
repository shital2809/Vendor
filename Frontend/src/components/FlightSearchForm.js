
// import { useState, useCallback } from "react";
// import { IoMdSwap } from "react-icons/io";
// import { FaCalendarAlt, FaPlaneDeparture, FaPlaneArrival, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import debounce from "lodash/debounce";
// import { useAuth } from "../context/AuthContext";


// export default function FlightSearchForm() {
//   const { authData } = useAuth();
//   const [tripType, setTripType] = useState("One way");
//   const [cities, setCities] = useState([
//     { from: "", to: "", departDate: "", passengers: 1, fromSuggestions: [], toSuggestions: [], showFromDropdown: false, showToDropdown: false },
//   ]);
//   const [returnDate, setReturnDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const addCityPair = () => {
//     setCities([...cities, { from: "", to: "", departDate: "", passengers: 1, fromSuggestions: [], toSuggestions: [], showFromDropdown: false, showToDropdown: false }]);
//   };

//   const removeCityPair = (index) => {
//     if (cities.length > 1) {
//       const updatedCities = cities.filter((_, i) => i !== index);
//       setCities(updatedCities);
//     }
//   };

//   const updateCityPair = (index, field, value) => {
//     const updatedCities = [...cities];
//     updatedCities[index][field] = value;
//     setCities(updatedCities);
//   };

//   const swapFromTo = (index) => {
//     const updatedCities = [...cities];
//     const temp = updatedCities[index].from;
//     updatedCities[index].from = updatedCities[index].to;
//     updatedCities[index].to = temp;
//     setCities(updatedCities);
//   };

//   const debouncedAirportSearch = useCallback(
//     debounce(async (index, field, query) => {
//       if (!query || query.length < 2) {
//         const updatedCities = [...cities];
//         updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
//         updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
//         setCities(updatedCities);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5000/api/flights/live-airport-search?term=${query}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${authData?.token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to fetch airport suggestions");
//         }

//         const data = await response.json();
//         const queryLower = query.toLowerCase();
//         const filteredSuggestions = data.filter((airport) =>
//           airport.label.toLowerCase().includes(queryLower)
//         ).sort((a, b) => {
//           const aLabelLower = a.label.toLowerCase();
//           const bLabelLower = b.label.toLowerCase();
//           const aStartsWith = aLabelLower.startsWith(queryLower);
//           const bStartsWith = bLabelLower.startsWith(queryLower);
//           if (aStartsWith && !bStartsWith) return -1;
//           if (!aStartsWith && bStartsWith) return 1;
//           const aIndex = aLabelLower.indexOf(queryLower);
//           const bIndex = bLabelLower.indexOf(queryLower);
//           return aIndex !== bIndex ? aIndex - bIndex : aLabelLower.localeCompare(bLabelLower);
//         });

//         const updatedCities = [...cities];
//         updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = filteredSuggestions;
//         updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = true;
//         setCities(updatedCities);
//       } catch (error) {
//         setError("Failed to fetch airport suggestions. Please try again.");
//         const updatedCities = [...cities];
//         updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
//         updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
//         setCities(updatedCities);
//       }
//     }, 300),
//     [cities, authData]
//   );

//   const handleAirportSearch = (index, field, query) => {
//     debouncedAirportSearch(index, field, query);
//   };

//   const handleSearch = async () => {
//     if (!authData) {
//       setError("Please log in to search for flights.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const firstLeg = cities[0];
//       if (!firstLeg.from || !firstLeg.to || !firstLeg.departDate) {
//         throw new Error("Please fill in all required fields (From, To, Depart Date).");
//       }

//       const origin = firstLeg.from.toUpperCase();
//       const destination = firstLeg.to.toUpperCase();

//       const response = await fetch(
//         `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&date=${firstLeg.departDate}${
//           tripType === "Roundtrip" && returnDate ? `&returnDate=${returnDate}` : ""
//         }`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${authData.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch flights");
//       }

//       const data = await response.json();

//       // Pass data to HorizontalSearchForm via navigation state
//       navigate("/flight-results", {
//         state: {
//           flights: data.flights,
//           initialData: {
//             departure: firstLeg.from,
//             destination: firstLeg.to,
//             departureDate: firstLeg.departDate,
//             returnDate: tripType === "Roundtrip" ? returnDate : "",
//             passengers: firstLeg.passengers,
//           },
//         },
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get today's date in YYYY-MM-DD format for min attribute
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="bg-white rounded-lg space-y-4 p-4">
//       {/* Traveler & Flight Options */}
//       <div className="flex flex-col space-y-2">
//         <div className="flex justify-between items-center">
//           <div>
//             <label className="font-bold">Traveler:</label>
//             <span className="font-semibold"> {authData ? authData.name : "Guest"}</span>
//           </div>
//           <select
//             className="border p-2 rounded-lg text-sm"
//             value={tripType}
//             onChange={(e) => setTripType(e.target.value)}
//           >
//             <option>One way</option>
//             <option>Roundtrip</option>
//             <option>Multi-city</option>
//           </select>
//         </div>
//         <label className="flex items-center text-sm">
//           <input type="checkbox" className="mr-2" /> Nonstop flights only
//         </label>
//       </div>

//       {/* City Pairs and Date Inputs */}
//       {cities.map((city, index) => (
//         <div key={index} className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 border-b pb-4 mb-4">
//           <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:w-1/2">
//             <div className="flex border px-3 py-2 rounded-full items-center relative lg:w-full">
//               <FaPlaneDeparture className="text-gray-500 absolute left-3" />
//               <input
//                 type="text"
//                 placeholder="From"
//                 className="w-full outline-none pl-10 text-sm lg:text-base"
//                 value={city.from}
//                 onChange={(e) => {
//                   updateCityPair(index, "from", e.target.value);
//                   handleAirportSearch(index, "from", e.target.value);
//                 }}
//               />
//               {city.showFromDropdown && city.fromSuggestions.length > 0 && (
//                 <div className="absolute z-10 mt-12 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[240px] overflow-y-auto">
//                   {city.fromSuggestions.map((airport) => (
//                     <div
//                       key={airport.value}
//                       className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
//                       onClick={() => {
//                         updateCityPair(index, "from", airport.value);
//                         const updatedCities = [...cities];
//                         updatedCities[index].showFromDropdown = false;
//                         setCities(updatedCities);
//                       }}
//                     >
//                       <span className="block text-sm font-medium">{airport.label}</span>
//                       <span className="block text-xs text-gray-500">{airport.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex border px-3 py-2 rounded-full items-center relative lg:w-full">
//               <FaPlaneArrival className="text-gray-500 absolute left-3" />
//               <input
//                 type="text"
//                 placeholder="To"
//                 className="w-full outline-none pl-10 text-sm lg:text-base"
//                 value={city.to}
//                 onChange={(e) => {
//                   updateCityPair(index, "to", e.target.value);
//                   handleAirportSearch(index, "to", e.target.value);
//                 }}
//               />
//               <IoMdSwap className="text-gray-600 absolute right-3 cursor-pointer text-2xl hidden lg:block" onClick={() => swapFromTo(index)} />
//               {city.showToDropdown && city.toSuggestions.length > 0 && (
//                 <div className="absolute z-10 mt-12 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[240px] overflow-y-auto">
//                   {city.toSuggestions.map((airport) => (
//                     <div
//                       key={airport.value}
//                       className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
//                       onClick={() => {
//                         updateCityPair(index, "to", airport.value);
//                         const updatedCities = [...cities];
//                         updatedCities[index].showToDropdown = false;
//                         setCities(updatedCities);
//                       }}
//                     >
//                       <span className="block text-sm font-medium">{airport.label}</span>
//                       <span className="block text-xs text-gray-500">{airport.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:w-1/2">
//             <div className="flex border px-3 py-2 rounded-full items-center lg:w-full">
//               <FaCalendarAlt className="text-gray-500 mr-2 text-xl" />
//               <input
//                 type="date"
//                 className="w-full outline-none text-sm lg:text-base"
//                 value={city.departDate}
//                 onChange={(e) => updateCityPair(index, "departDate", e.target.value)}
//                 min={today}
//               />
//             </div>
//             {tripType === "Roundtrip" && index === 0 && (
//               <div className="flex border px-3 py-2 rounded-full items-center lg:w-full">
//                 <FaCalendarAlt className="text-gray-500 mr-2 text-xl hidden lg:block" />
//                 <input
//                   type="date"
//                   className="w-full outline-none text-sm lg:text-base"
//                   value={returnDate}
//                   onChange={(e) => setReturnDate(e.target.value)}
//                   min={city.departDate || today}
//                 />
//               </div>
//             )}
//           </div>
//           {tripType === "Multi-city" && index > 0 && (
//             <div className="flex items-center justify-center lg:w-auto">
//               <button onClick={() => removeCityPair(index)} className="text-red-500 hover:text-red-700">
//                 <FaTrash />
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//       {tripType === "Multi-city" && (
//         <div className="flex justify-center">
//           <button onClick={addCityPair} className="flex items-center space-x-2 text-purple-600 hover:text-purple-800">
//             <FaPlus />
//             <span>Add another city</span>
//           </button>
//         </div>
//       )}
//       {error && <div className="text-red-500 text-center">{error}</div>}
//       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0 text-sm mt-4">
//         <div className="flex justify-between lg:space-x-4">
//           <a href="#" className="text-purple-600 flex items-center">
//             ✨ Add a loyalty program
//           </a>
//           <a href="#" className="text-purple-500">Your flight policy</a>
//         </div>
//         <button
//           onClick={handleSearch}
//           disabled={loading}
//           className={`${loading ? "bg-gray-400" : "bg-gray-300"} text-gray-600 px-6 py-2 rounded-lg flex items-center justify-center space-x-2`}
//         >
//           <FaSearch />
//           <span>{loading ? "Searching..." : "Search"}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback } from "react";
import { IoMdSwap } from "react-icons/io";
import { FaCalendarAlt, FaPlaneDeparture, FaPlaneArrival, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useAuth } from "../context/AuthContext";
import { searchFlights, liveAirportSearch } from "../services/apiService";

export default function FlightSearchForm() {
  const { authData } = useAuth();
  const [tripType, setTripType] = useState("One way");
  const [cities, setCities] = useState([
    { from: "", to: "", departDate: "", passengers: 1, fromSuggestions: [], toSuggestions: [], showFromDropdown: false, showToDropdown: false },
  ]);
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addCityPair = () => {
    setCities([...cities, { from: "", to: "", departDate: "", passengers: 1, fromSuggestions: [], toSuggestions: [], showFromDropdown: false, showToDropdown: false }]);
  };

  const removeCityPair = (index) => {
    if (cities.length > 1) {
      const updatedCities = cities.filter((_, i) => i !== index);
      setCities(updatedCities);
    }
  };

  const updateCityPair = (index, field, value) => {
    const updatedCities = [...cities];
    updatedCities[index][field] = value;
    setCities(updatedCities);
  };

  const swapFromTo = (index) => {
    const updatedCities = [...cities];
    const temp = updatedCities[index].from;
    updatedCities[index].from = updatedCities[index].to;
    updatedCities[index].to = temp;
    setCities(updatedCities);
  };

  //search flights api call 
  
  // const debouncedAirportSearch = useCallback(
  //   debounce(async (index, field, query) => {
  //     if (!query || query.length < 2) {
  //       const updatedCities = [...cities];
  //       updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
  //       updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
  //       setCities(updatedCities);
  //       setError(null); // Clear error when input is too short
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`http://localhost:5000/api/flights/live-airport-search?term=${query}`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${authData?.token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         // Only set error if it's a critical issue (e.g., auth failure), otherwise log and suppress
  //         if (response.status === 401) {
  //           setError("Authentication failed. Please log in again.");
  //         } else {
  //           console.error("Failed to fetch airport suggestions:", errorData.error || "Unknown error");
  //         }
  //         const updatedCities = [...cities];
  //         updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
  //         updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
  //         setCities(updatedCities);
  //         return;
  //       }

  //       const data = await response.json();
  //       const queryLower = query.toLowerCase();
  //       const filteredSuggestions = data.filter((airport) =>
  //         airport.label.toLowerCase().includes(queryLower)
  //       ).sort((a, b) => {
  //         const aLabelLower = a.label.toLowerCase();
  //         const bLabelLower = b.label.toLowerCase();
  //         const aStartsWith = aLabelLower.startsWith(queryLower);
  //         const bStartsWith = bLabelLower.startsWith(queryLower);
  //         if (aStartsWith && !bStartsWith) return -1;
  //         if (!aStartsWith && bStartsWith) return 1;
  //         const aIndex = aLabelLower.indexOf(queryLower);
  //         const bIndex = bLabelLower.indexOf(queryLower);
  //         return aIndex !== bIndex ? aIndex - bIndex : aLabelLower.localeCompare(bLabelLower);
  //       });

  //       const updatedCities = [...cities];
  //       updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = filteredSuggestions;
  //       updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = true;
  //       setCities(updatedCities);
  //       setError(null); // Clear error on successful fetch
  //     } catch (error) {
  //       console.error("Failed to fetch airport suggestions:", error.message);
  //       // Do not set the error in the UI for suggestion failures
  //       const updatedCities = [...cities];
  //       updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
  //       updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
  //       setCities(updatedCities);
  //     }
  //   }, 300),
  //   [cities, authData]
  // );

  // const handleAirportSearch = (index, field, query) => {
  //   debouncedAirportSearch(index, field, query);
  // };

  // const handleSearch = async () => {
  //   if (!authData) {
  //     setError("Please log in to search for flights.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const firstLeg = cities[0];
  //     if (!firstLeg.from || !firstLeg.to || !firstLeg.departDate) {
  //       throw new Error("Please fill in all required fields (From, To, Depart Date).");
  //     }

  //     const origin = firstLeg.from.toUpperCase();
  //     const destination = firstLeg.to.toUpperCase();

  //     const response = await fetch(
  //       `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&date=${firstLeg.departDate}${
  //         tripType === "Roundtrip" && returnDate ? `&returnDate=${returnDate}` : ""
  //       }`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${authData.token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to fetch flights");
  //     }

  //     const data = await response.json();

  //     // Pass data to HorizontalSearchForm via navigation state
  //     navigate("/flight-results", {
  //       state: {
  //         flights: data.flights,
  //         initialData: {
  //           departure: firstLeg.from,
  //           destination: firstLeg.to,
  //           departureDate: firstLeg.departDate,
  //           returnDate: tripType === "Roundtrip" ? returnDate : "",
  //           passengers: firstLeg.passengers,
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const debouncedAirportSearch = useCallback(
    debounce(async (index, field, query) => {
      if (!query || query.length < 2) {
        const updatedCities = [...cities];
        updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
        updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
        setCities(updatedCities);
        setError(null);
        return;
      }

      try {
        const data = await liveAirportSearch(query);
        const queryLower = query.toLowerCase();
        const filteredSuggestions = data
          .filter((airport) => airport.label.toLowerCase().includes(queryLower))
          .sort((a, b) => {
            const aLabelLower = a.label.toLowerCase();
            const bLabelLower = b.label.toLowerCase();
            const aStartsWith = aLabelLower.startsWith(queryLower);
            const bStartsWith = bLabelLower.startsWith(queryLower);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            const aIndex = aLabelLower.indexOf(queryLower);
            const bIndex = bLabelLower.indexOf(queryLower);
            return aIndex !== bIndex ? aIndex - bIndex : aLabelLower.localeCompare(bLabelLower);
          });

        const updatedCities = [...cities];
        updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = filteredSuggestions;
        updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = true;
        setCities(updatedCities);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch airport suggestions:", error.message);
        const updatedCities = [...cities];
        updatedCities[index][field === "from" ? "fromSuggestions" : "toSuggestions"] = [];
        updatedCities[index][field === "from" ? "showFromDropdown" : "showToDropdown"] = false;
        setCities(updatedCities);
      }
    }, 300),
    [cities]
  );

  const handleAirportSearch = (index, field, query) => {
    debouncedAirportSearch(index, field, query);
  };

  const handleSearch = async () => {
    if (!authData) {
      setError("Please log in to search for flights.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const firstLeg = cities[0];
      if (!firstLeg.from || !firstLeg.to || !firstLeg.departDate) {
        throw new Error("Please fill in all required fields (From, To, Depart Date).");
      }

      const origin = firstLeg.from.toUpperCase();
      const destination = firstLeg.to.toUpperCase();
      const data = await searchFlights(
        origin,
        destination,
        firstLeg.departDate,
        tripType === "Roundtrip" ? returnDate : undefined
      );

      navigate("/flight-results", {
        state: {
          flights: data.flights,
          initialData: {
            departure: firstLeg.from,
            destination: firstLeg.to,
            departureDate: firstLeg.departDate,
            returnDate: tripType === "Roundtrip" ? returnDate : "",
            passengers: firstLeg.passengers,
          },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-lg space-y-4 p-4">
      {/* Traveler & Flight Options */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <label className="font-bold">Traveler:</label>
            <span className="font-semibold"> {authData ? authData.name : "Guest"}</span>
          </div>
          <select
            className="border p-2 rounded-lg text-sm"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option>One way</option>
            <option>Roundtrip</option>
            <option>Multi-city</option>
          </select>
        </div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="mr-2" /> Nonstop flights only
        </label>
      </div>

      {/* City Pairs and Date Inputs */}
      {cities.map((city, index) => (
        <div key={index} className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 border-b pb-4 mb-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:w-1/2">
            <div className="flex border px-3 py-2 rounded-full items-center relative lg:w-full">
              <FaPlaneDeparture className="text-gray-500 absolute left-3" />
              <input
                type="text"
                placeholder="From"
                className="w-full outline-none pl-10 text-sm lg:text-base"
                value={city.from}
                onChange={(e) => {
                  updateCityPair(index, "from", e.target.value);
                  handleAirportSearch(index, "from", e.target.value);
                }}
              />
              {city.showFromDropdown && city.fromSuggestions.length > 0 && (
                <div className="absolute z-10 mt-12 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[240px] overflow-y-auto">
                  {city.fromSuggestions.map((airport) => (
                    <div
                      // key={airport.value}
                      key = {`${airport.value}-${airport.label}`}
                      className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        updateCityPair(index, "from", airport.value);
                        const updatedCities = [...cities];
                        updatedCities[index].showFromDropdown = false;
                        setCities(updatedCities);
                      }}
                    >
                      <span className="block text-sm font-medium">{airport.label}</span>
                      <span className="block text-xs text-gray-500">{airport.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex border px-3 py-2 rounded-full items-center relative lg:w-full">
              <FaPlaneArrival className="text-gray-500 absolute left-3" />
              <input
                type="text"
                placeholder="To"
                className="w-full outline-none pl-10 text-sm lg:text-base"
                value={city.to}
                onChange={(e) => {
                  updateCityPair(index, "to", e.target.value);
                  handleAirportSearch(index, "to", e.target.value);
                }}
              />
              <IoMdSwap className="text-gray-600 absolute right-3 cursor-pointer text-2xl hidden lg:block" onClick={() => swapFromTo(index)} />
              {city.showToDropdown && city.toSuggestions.length > 0 && (
                <div className="absolute z-10 mt-12 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[240px] overflow-y-auto">
                  {city.toSuggestions.map((airport) => (
                    <div
                      // key={airport.value}
                      key = {`${airport.value}-${airport.label}`}
                      className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        updateCityPair(index, "to", airport.value);
                        const updatedCities = [...cities];
                        updatedCities[index].showToDropdown = false;
                        setCities(updatedCities);
                      }}
                    >
                      <span className="block text-sm font-medium">{airport.label}</span>
                      <span className="block text-xs text-gray-500">{airport.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:w-1/2">
            <div className="flex border px-3 py-2 rounded-full items-center lg:w-full">
              <FaCalendarAlt className="text-gray-500 mr-2 text-xl" />
              <input
                type="date"
                className="w-full outline-none text-sm lg:text-base"
                value={city.departDate}
                onChange={(e) => updateCityPair(index, "departDate", e.target.value)}
                min={today}
              />
            </div>
            {tripType === "Roundtrip" && index === 0 && (
              <div className="flex border px-3 py-2 rounded-full items-center lg:w-full">
                <FaCalendarAlt className="text-gray-500 mr-2 text-xl hidden lg:block" />
                <input
                  type="date"
                  className="w-full outline-none text-sm lg:text-base"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={city.departDate || today}
                />
              </div>
            )}
          </div>
          {tripType === "Multi-city" && index > 0 && (
            <div className="flex items-center justify-center lg:w-auto">
              <button onClick={() => removeCityPair(index)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      ))}
      {tripType === "Multi-city" && (
        <div className="flex justify-center">
          <button onClick={addCityPair} className="flex items-center space-x-2 text-purple-600 hover:text-purple-800">
            <FaPlus />
            <span>Add another city</span>
          </button>
        </div>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0 text-sm mt-4">
        <div className="flex justify-between lg:space-x-4">
          <a href="#" className="text-purple-600 flex items-center">
            ✨ Add a loyalty program
          </a>
          <a href="#" className="text-purple-500">Your flight policy</a>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`${loading ? "bg-gray-400" : "bg-gray-300"} text-gray-600 px-6 py-2 rounded-lg flex items-center justify-center space-x-2`}
        >
          <FaSearch />
          <span>{loading ? "Searching..." : "Search"}</span>
        </button>
      </div>
    </div>
  );
}