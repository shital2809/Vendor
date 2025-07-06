
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import debounce from "lodash/debounce";
// import { useAuth } from "../context/AuthContext"; // Adjust path as needed
// import Button from "../components/Button";
// import PassengerDropdown from "../section/PassengerDropdown"; // Adjust path if needed

// const HorizontalSearchForm = ({ initialData = {}, onSearch }) => {
//   const { authData } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     departure: initialData.departure || "",
//     destination: initialData.destination || "",
//     departureDate: initialData.departureDate || "",
//     returnDate: initialData.returnDate || "",
//     passengers: initialData.passengers || 1,
//   });
//   const [error, setError] = useState("");
//   const [departureSuggestions, setDepartureSuggestions] = useState([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState([]);
//   const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
//   const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const departureRef = useRef(null);
//   const destinationRef = useRef(null);

//   // Get token from localStorage as fallback
//   const getToken = () => {
//     return authData?.token || localStorage.getItem("auth_token") || null;
//   };

//   const debouncedAirportSearch = useCallback(
//     debounce(async (field, query) => {
//       console.log("Fetching suggestions for", field, query);
//       if (!query || query.length < 2) {
//         if (field === "departure") {
//           setDepartureSuggestions([]);
//           setShowDepartureDropdown(false);
//         } else {
//           setDestinationSuggestions([]);
//           setShowDestinationDropdown(false);
//         }
//         return;
//       }

//       try {
//         const token = getToken();
//         if (!token) {
//           setError("No authentication token available. Please log in.");
//           return;
//         }

//         const response = await fetch(`http://localhost:5000/api/flights/live-airport-search?term=${query}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("Response status:", response.status);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to fetch airport suggestions");
//         }

//         const data = await response.json();
//         console.log("API Data:", data);
//         const queryLower = query.toLowerCase();
//         const filteredSuggestions = data
//           .filter((airport) => airport.label.toLowerCase().includes(queryLower))
//           .sort((a, b) => {
//             const aLabelLower = a.label.toLowerCase();
//             const bLabelLower = b.label.toLowerCase();
//             const aStartsWith = aLabelLower.startsWith(queryLower);
//             const bStartsWith = bLabelLower.startsWith(queryLower);
//             if (aStartsWith && !bStartsWith) return -1;
//             if (!aStartsWith && bStartsWith) return 1;
//             const aIndex = aLabelLower.indexOf(queryLower);
//             const bIndex = bLabelLower.indexOf(queryLower);
//             return aIndex !== bIndex ? aIndex - bIndex : aLabelLower.localeCompare(bLabelLower);
//           });

//         if (field === "departure") {
//           setDepartureSuggestions(filteredSuggestions);
//           setShowDepartureDropdown(true);
//         } else {
//           setDestinationSuggestions(filteredSuggestions);
//           setShowDestinationDropdown(true);
//         }
//       } catch (error) {
//         console.error("Error fetching suggestions:", error);
//         setError("Failed to fetch airport suggestions. Please try again.");
//         if (field === "departure") {
//           setDepartureSuggestions([]);
//           setShowDepartureDropdown(false);
//         } else {
//           setDestinationSuggestions([]);
//           setShowDestinationDropdown(false);
//         }
//       }
//     }, 300),
//     []
//   );

//   const handleInputChange = (value, type) => {
//     setFormData((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//     debouncedAirportSearch(type, value);
//   };

//   const handleSuggestionSelect = (suggestion, type) => {
//     setFormData((prev) => ({
//       ...prev,
//       [type]: suggestion.value || "",
//     }));
//     if (type === "departure") {
//       setShowDepartureDropdown(false);
//     } else {
//       setShowDestinationDropdown(false);
//     }
//   };

//   const handlePassengerChange = (newTotal) => {
//     setFormData((prev) => ({
//       ...prev,
//       passengers: Math.max(1, newTotal),
//     }));
//   };

//   const handleSearch = async () => {
//     const token = getToken();
//     if (!token) {
//       setError("Please log in to search for flights.");
//       return;
//     }

//     const { departure, destination, departureDate, returnDate, passengers } = formData;

//     if (!departure || !destination || !departureDate) {
//       setError("Please fill all required fields (Departure, Destination, Depart Date).");
//       return;
//     }

//     if (returnDate && returnDate < departureDate) {
//       setError("Return date must be after departure date.");
//       return;
//     }

//     const iataRegex = /^[A-Z]{3}$/;
//     if (!iataRegex.test(departure) || !iataRegex.test(destination)) {
//       setError("Please enter valid 3-letter IATA codes (e.g., HYD, BOM).");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const origin = departure.toUpperCase();
//       const destinationUpper = destination.toUpperCase(); // Use a new variable name

//       const response = await fetch(
//         `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destinationUpper}&date=${departureDate}${
//           returnDate ? `&returnDate=${returnDate}` : ""
//         }`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch flights");
//       }

//       const data = await response.json();
//       console.log("Flight Search Response:", data);

//       navigate("/flight-results", {
//         state: {
//           flights: data.flights,
//           origin,
//           destination: destinationUpper, // Use the new variable
//           date: departureDate,
//           returnDate,
//           passengers,
//         },
//       });

//       if (onSearch) {
//         onSearch({
//           flights: data.flights,
//           passengers,
//           departure: origin,
//           destination: destinationUpper,
//           departureDate,
//           returnDate,
//         });
//       }
//     } catch (err) {
//       console.error("Search Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (departureRef.current && !departureRef.current.contains(event.target)) {
//         setShowDepartureDropdown(false);
//       }
//       if (destinationRef.current && !destinationRef.current.contains(event.target)) {
//         setShowDestinationDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl mb-8 mx-auto max-w-6xl relative z-[1000]">
//       <div className="flex flex-col sm:flex-row sm:items-end gap-4">
//         <div className="relative flex-1 min-w-[150px]" ref={departureRef}>
//           <label className="block text-sm font-medium text-white mb-1">From</label>
//           <input
//             type="text"
//             value={formData.departure}
//             onChange={(e) => handleInputChange(e.target.value, "departure")}
//             className="w-full p-3 rounded-lg border bg-white text-gray-800 shadow-sm"
//             placeholder="Departure (e.g., HYD)"
//           />
//           {showDepartureDropdown && departureSuggestions.length > 0 && (
//             <ul className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-[3000]">
//               {departureSuggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleSuggestionSelect(suggestion, "departure");
//                   }}
//                 >
//                   <span className="font-semibold">{suggestion.value}</span> - {suggestion.label}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="relative flex-1 min-w-[150px]" ref={destinationRef}>
//           <label className="block text-sm font-medium text-white mb-1">To</label>
//           <input
//             type="text"
//             value={formData.destination}
//             onChange={(e) => handleInputChange(e.target.value, "destination")}
//             className="w-full p-3 rounded-lg border bg-white text-gray-800 shadow-sm"
//             placeholder="Destination (e.g., BOM)"
//           />
//           {showDestinationDropdown && destinationSuggestions.length > 0 && (
//             <ul className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-[3000]">
//               {destinationSuggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleSuggestionSelect(suggestion, "destination");
//                   }}
//                 >
//                   <span className="font-semibold">{suggestion.value}</span> - {suggestion.label}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="flex-1 min-w-[150px]">
//           <label className="block text-sm font-medium text-white mb-1">Depart</label>
//           <input
//             type="date"
//             value={formData.departureDate}
//             onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
//             min={new Date().toISOString().split("T")[0]}
//             className="w-full p-3 rounded-lg border bg-white text-gray-800 shadow-sm"
//           />
//         </div>

//         <div className="flex-1 min-w-[150px]">
//           <label className="block text-sm font-medium text-white mb-1">Return</label>
//           <input
//             type="date"
//             value={formData.returnDate}
//             onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
//             min={formData.departureDate || new Date().toISOString().split("T")[0]}
//             className="w-full p-3 rounded-lg border bg-white text-gray-800 shadow-sm"
//           />
//         </div>

//         <div className="flex-1 min-w-[150px]">
//           {/* <label className="block text-sm font-medium text-white mb-1">Passengers</label> */}
//           <PassengerDropdown
//             onPassengerChange={handlePassengerChange}
//             initialCount={formData.passengers}
//           />
//         </div>

//         <Button
//           className={`${
//             loading ? "bg-gray-400" : "bg-indigo-700 hover:bg-indigo-800"
//           } text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
//           onClick={handleSearch}
//           disabled={loading}
//         >
//           {loading ? "Searching..." : "Search"}
//         </Button>
//       </div>

//       {error && <p className="text-red-300 text-sm mt-3 text-center">{error}</p>}
//     </div>
//   );
// };

// export default HorizontalSearchForm;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const HorizontalSearchForm = ({ initialData = {}, onSearch }) => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departure: initialData.departure || "",
    destination: initialData.destination || "",
    departureDate: initialData.departureDate || "",
    returnDate: initialData.returnDate || "",
    passengers: initialData.passengers || 1,
  });
  const [error, setError] = useState("");
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const departureRef = useRef(null);
  const destinationRef = useRef(null);

  const getToken = () => {
    return authData?.token || localStorage.getItem("auth_token") || null;
  };

  const debouncedAirportSearch = useCallback(
    debounce(async (field, query) => {
      if (!query || query.length < 2) {
        if (field === "departure") {
          setDepartureSuggestions([]);
          setShowDepartureDropdown(false);
        } else {
          setDestinationSuggestions([]);
          setShowDestinationDropdown(false);
        }
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setError("No authentication token available. Please log in.");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/flights/live-airport-search?term=${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch airport suggestions");
        }

        const data = await response.json();
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

        if (field === "departure") {
          setDepartureSuggestions(filteredSuggestions);
          setShowDepartureDropdown(true);
        } else {
          setDestinationSuggestions(filteredSuggestions);
          setShowDestinationDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setError("Failed to fetch airport suggestions. Please try again.");
        if (field === "departure") {
          setDepartureSuggestions([]);
          setShowDepartureDropdown(false);
        } else {
          setDestinationSuggestions([]);
          setShowDestinationDropdown(false);
        }
      }
    }, 300),
    []
  );

  const handleInputChange = (value, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: value,
    }));
    debouncedAirportSearch(type, value);
  };

  const handleSuggestionSelect = (suggestion, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: suggestion.value || "",
    }));
    if (type === "departure") {
      setShowDepartureDropdown(false);
    } else {
      setShowDestinationDropdown(false);
    }
  };

  const handlePassengerChange = (newTotal) => {
    setFormData((prev) => ({
      ...prev,
      passengers: Math.max(1, newTotal),
    }));
  };

  const handleSearch = async () => {
    const token = getToken();
    if (!token) {
      setError("Please log in to search for flights.");
      return;
    }

    const { departure, destination, departureDate, returnDate, passengers } = formData;

    if (!departure || !destination || !departureDate) {
      setError("Please fill all required fields (Departure, Destination, Depart Date).");
      return;
    }

    if (returnDate && returnDate < departureDate) {
      setError("Return date must be after departure date.");
      return;
    }

    const iataRegex = /^[A-Z]{3}$/;
    if (!iataRegex.test(departure) || !iataRegex.test(destination)) {
      setError("Please enter valid 3-letter IATA codes (e.g., HYD, BOM).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const origin = departure.toUpperCase();
      const destinationUpper = destination.toUpperCase();

      const response = await fetch(
        `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destinationUpper}&date=${departureDate}${
          returnDate ? `&returnDate=${returnDate}` : ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch flights");
      }

      const data = await response.json();

      navigate("/flight-results", {
        state: {
          flights: data.flights,
          origin,
          destination: destinationUpper,
          date: departureDate,
          returnDate,
          passengers,
        },
      });

      if (onSearch) {
        onSearch({
          flights: data.flights,
          passengers,
          departure: origin,
          destination: destinationUpper,
          departureDate,
          returnDate,
        });
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-r from-white to-white p-6 rounded-2xl shadow-xl mb-8 mx-auto max-w-6xl relative z-[1000]">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="relative flex-1 min-w-[150px]" ref={departureRef}>
          <label className="block text-sm font-medium text-black mb-1">From</label>
          <input
            type="text"
            value={formData.departure}
            onChange={(e) => handleInputChange(e.target.value, "departure")}
            className="w-full p-3 rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
            placeholder="Departure (e.g., HYD)"
          />
          {showDepartureDropdown && departureSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full mt-2 bg-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-[3000]">
              {departureSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionSelect(suggestion, "departure");
                  }}
                >
                  <span className="font-semibold">{suggestion.value}</span> - {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex-1 min-w-[150px]" ref={destinationRef}>
          <label className="block text-sm font-medium text-black mb-1">To</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => handleInputChange(e.target.value, "destination")}
            className="w-full p-3 rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
            placeholder="Destination (e.g., BOM)"
          />
          {showDestinationDropdown && destinationSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full mt-2 bg-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-[3000]">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionSelect(suggestion, "destination");
                  }}
                >
                  <span className="font-semibold">{suggestion.value}</span> - {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-black mb-1">Depart</label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange(e.target.value, "departureDate")}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-black mb-1">Return</label>
          <input
            type="date"
            value={formData.returnDate}
            onChange={(e) => handleInputChange(e.target.value, "returnDate")}
            min={formData.departureDate || new Date().toISOString().split("T")[0]}
            className="w-full p-3 rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-black mb-1">Passengers</label>
          <input
            type="number"
            value={formData.passengers}
            onChange={(e) => handlePassengerChange(parseInt(e.target.value) || 1)}
            min="1"
            className="w-full p-3 rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
          />
        </div>

        <Button
          className={`${
            loading ? "bg-blue-800" : "bg-blue-800 hover:bg-gray-300"
          } text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-300 text-sm mt-3 text-center">{error}</p>}
    </div>
  );
};

export default HorizontalSearchForm;