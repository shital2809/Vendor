// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import FilterSection from "../section/FilterSection";
// import HorizontalSearchForm from "../section/HorizontalSearchForm";
// import BookingResponse from "../pages/BookingResponse";

// const FlightResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initialize state from location.state
//   const initialState = location.state || {};
//   const { flights = [], initialData = {} } = initialState;
//   const [originalFlights, setOriginalFlights] = useState(flights);
//   const [passengers, setPassengers] = useState(initialData.passengers || 1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filteredFlights, setFilteredFlights] = useState(originalFlights);

//   // Initialize searchFormData from initialData
//   const searchFormData = {
//     departure: initialData.departure || "",
//     destination: initialData.destination || "",
//     departureDate: initialData.departureDate || "",
//     returnDate: initialData.returnDate || "",
//     passengers: initialData.passengers || 1,
//   };

//   useEffect(() => {
//     // Update filteredFlights only if originalFlights changes
//     if (JSON.stringify(filteredFlights) !== JSON.stringify(originalFlights)) {
//       setFilteredFlights(originalFlights);
//     }
//   }, [originalFlights]);

//   const formatDuration = (duration) => {
//     const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
//     if (!match) return duration.replace("PT", "").toLowerCase();
//     const hours = match[1].padStart(2, "0");
//     const minutes = match[2] ? match[2].padStart(2, "0") : "00";
//     return `${hours}h ${minutes}m`;
//   };

//   const calculateStops = (segments) => {
//     return segments.length - 1;
//   };

//   const calculateRewards = (price) => {
//     return Math.floor(price / 10);
//   };

//   const filterFlights = (criteria) => {
//     let result = [...originalFlights];
//     if (criteria.priceRange) {
//       result = result.filter(
//         (flight) => parseFloat(flight.price.grandTotal) <= criteria.priceRange
//       );
//     }
//     if (criteria.stops.length > 0) {
//       result = result.filter((flight) => {
//         const stopsCount = calculateStops(flight.itineraries[0].segments);
//         return (
//           (criteria.stops.includes("nonStop") && stopsCount === 0) ||
//           (criteria.stops.includes("oneStop") && stopsCount === 1) ||
//           (criteria.stops.includes("twoPlusStops") && stopsCount >= 2)
//         );
//       });
//     }
//     if (criteria.airlines.length > 0) {
//       result = result.filter((flight) =>
//         flight.validatingAirlineCodes.some((code) =>
//           criteria.airlines.includes(code)
//         )
//       );
//     }
//     if (criteria.departureTimes.length > 0) {
//       result = result.filter((flight) => {
//         const departureHour = new Date(
//           flight.itineraries[0].segments[0].departure.at
//         ).getUTCHours();
//         return (
//           (criteria.departureTimes.includes("morning") &&
//             departureHour >= 6 &&
//             departureHour < 12) ||
//           (criteria.departureTimes.includes("afternoon") &&
//             departureHour >= 12 &&
//             departureHour < 18) ||
//           (criteria.departureTimes.includes("evening") &&
//             departureHour >= 18 &&
//             departureHour < 24)
//         );
//       });
//     }
//     if (criteria.arrivalTimes.length > 0) {
//       result = result.filter((flight) => {
//         const lastSegment =
//           flight.itineraries[0].segments[
//             flight.itineraries[0].segments.length - 1
//           ];
//         const arrivalHour = new Date(lastSegment.arrival.at).getUTCHours();
//         return (
//           (criteria.arrivalTimes.includes("morning") &&
//             arrivalHour >= 6 &&
//             arrivalHour < 12) ||
//           (criteria.arrivalTimes.includes("afternoon") &&
//             arrivalHour >= 12 &&
//             arrivalHour < 18) ||
//           (criteria.arrivalTimes.includes("evening") &&
//             arrivalHour >= 18 &&
//             arrivalHour < 24)
//         );
//       });
//     }
//     setFilteredFlights(result);
//   };

//   const handleSearchUpdate = useCallback(
//     (newSearchData) => {
//       // Only update if the search parameters have changed and flights data exists
//       const isDifferent =
//         newSearchData.departure !== searchFormData.departure ||
//         newSearchData.destination !== searchFormData.destination ||
//         newSearchData.departureDate !== searchFormData.departureDate ||
//         newSearchData.returnDate !== searchFormData.returnDate ||
//         newSearchData.passengers !== searchFormData.passengers;

//       if (
//         isDifferent &&
//         newSearchData.flights &&
//         newSearchData.flights.length > 0
//       ) {
//         setOriginalFlights(newSearchData.flights);
//         setPassengers(newSearchData.passengers);
//         navigate("/flight-results", {
//           state: {
//             flights: newSearchData.flights,
//             initialData: {
//               departure: newSearchData.departure,
//               destination: newSearchData.destination,
//               departureDate: newSearchData.departureDate,
//               returnDate: newSearchData.returnDate,
//               passengers: newSearchData.passengers,
//             },
//           },
//           replace: true,
//         });
//       }
//     },
//     [
//       navigate,
//       searchFormData.departure,
//       searchFormData.destination,
//       searchFormData.departureDate,
//       searchFormData.returnDate,
//       searchFormData.passengers,
//     ]
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const handleBookNow = async (flight) => {
//     setIsLoading(true);
//     const departureSegment = flight.itineraries[0].segments[0];
//     const arrivalSegment =
//       flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//     const departureTime = new Date(
//       departureSegment.departure.at
//     ).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//     const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString(
//       [],
//       {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       }
//     );
//     const duration = formatDuration(flight.itineraries[0].duration);
//     const stops = calculateStops(flight.itineraries[0].segments);

//     const token = localStorage.getItem("auth_token");
//     console.log("Auth token:", token);
//     if (!token) {
//       alert("Please log in to book a flight.");
//       navigate("/login");
//       setIsLoading(false);
//       return;
//     }

//     const requestData = { flightOffer: flight };
//     console.log("Sending request data:", JSON.stringify(requestData, null, 2));

//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//       const response = await fetch(`${apiUrl}/api/flights/price`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       });

//       console.log("API response status:", response.status);
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API error response:", errorText);
//         throw new Error(
//           `HTTP error! status: ${response.status}, message: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       console.log("API response data:", data);

//       if (!data.pricedOffer) {
//         throw new Error("No priced offer returned from the API");
//       }

//       const transformedResponse = {
//         departure: departureSegment.departure,
//         arrival: arrivalSegment.arrival,
//         departureTime,
//         arrivalTime,
//         duration,
//         stops,
//         aircraft: "AIRBUS JET",
//         fare: parseFloat(data.pricedOffer.price.grandTotal) || 5387,
//         discount: 213.45,
//         insurance: 199,
//         additionalDiscount: 37.55,
//         totalAmount: parseFloat(data.pricedOffer.price.grandTotal) || 5335,
//       };

//       navigate("/booking", { state: { bookingResponse: transformedResponse } });
//     } catch (error) {
//       console.error("Error calling price API:", error.message);
//       alert(
//         "Failed to fetch price details. Please try again or contact support."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div
//       className="min-h-screen bg-gray-200"
//       style={{
//         backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
//         <div className="sticky top-0 z-[2000] bg-opacity-95 backdrop-blur-md">
//           <HorizontalSearchForm
//             initialData={searchFormData}
//             onSearch={handleSearchUpdate}
//           />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="lg:w-1/4 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] z-[1500]">
//             <FilterSection
//               isOpen={isFilterOpen}
//               onClose={() => setIsFilterOpen(false)}
//               flights={originalFlights}
//               onFilterChange={filterFlights}
//             />
//             <button
//               className="lg:hidden mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//             >
//               {isFilterOpen ? "Close Filters" : "Open Filters"}
//             </button>
//           </div>

//           <div className="lg:w-3/4">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-xl shadow-md">
//               <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 drop-shadow-lg">
//                 MultiflyTravel
//               </h1>
//               <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-700 mt-2 sm:mt-0">
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure
//                     .iataCode || "N/A"}{" "}
//                   -{" "}
//                   {filteredFlights[0]?.itineraries[0]?.segments[
//                     filteredFlights[0]?.itineraries[0]?.segments.length - 1
//                   ]?.arrival.iataCode || "N/A"}
//                 </p>
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
//                     ? new Date(
//                         filteredFlights[0].itineraries[0].segments[0].departure.at
//                       ).toLocaleDateString("en-US", {
//                         day: "numeric",
//                         month: "short",
//                       })
//                     : "N/A"}
//                 </p>
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {passengers} Passenger{passengers !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="max-h-[calc(100vh-12rem)] overflow-y-auto no-scroll space-y-4 pr-2">
//               {filteredFlights.length > 0 ? (
//                 filteredFlights.map((flight, index) => {
//                   const departureSegment = flight.itineraries[0].segments[0];
//                   const arrivalSegment =
//                     flight.itineraries[0].segments[
//                       flight.itineraries[0].segments.length - 1
//                     ];
//                   const departureTime = departureSegment.departure.at
//                     ? new Date(
//                         departureSegment.departure.at
//                       ).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })
//                     : "N/A";
//                   const arrivalTime = arrivalSegment.arrival.at
//                     ? new Date(arrivalSegment.arrival.at).toLocaleTimeString(
//                         [],
//                         { hour: "2-digit", minute: "2-digit", hour12: false }
//                       )
//                     : "N/A";
//                   const duration = flight.itineraries[0].duration
//                     ? formatDuration(flight.itineraries[0].duration)
//                     : "N/A";
//                   const stops = calculateStops(flight.itineraries[0].segments);
//                   const price = flight.price?.grandTotal
//                     ? parseFloat(flight.price.grandTotal).toLocaleString(
//                         "en-US",
//                         { minimumFractionDigits: 2, maximumFractionDigits: 2 }
//                       )
//                     : "N/A";
//                   const rewards = flight.price?.grandTotal
//                     ? calculateRewards(parseFloat(flight.price.grandTotal))
//                     : 0;
//                   const currency = flight.price?.currency || "USD";

//                   return (
//                     <div
//                       key={index}
//                       className="bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
//                     >
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
//                         <div className="flex space-x-2">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <div
//                               key={idx}
//                               className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
//                             ></div>
//                           ))}
//                         </div>
//                         <div className="text-sm text-gray-700 font-medium">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <span key={idx}>
//                               {code}{" "}
//                               {flight.itineraries[0].segments[idx]?.number ||
//                                 "N/A"}
//                               {idx < flight.validatingAirlineCodes.length - 1 &&
//                                 " + "}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
//                         <div className="text-center">
//                           <p className="text-lg sm:text-xl font-bold text-gray-800">
//                             {departureTime}
//                           </p>
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             {departureSegment.departure.iataCode || "N/A"},{" "}
//                             {departureSegment.departure.terminal
//                               ? `T${departureSegment.departure.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-sm text-gray-600 font-medium">
//                             {duration}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {stops} stop{stops !== 1 ? "s" : ""}
//                           </p>
//                           <div className="flex items-center justify-center mt-1">
//                             <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
//                             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//                             <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-lg sm:text-xl font-bold text-gray-800">
//                             {arrivalTime}
//                           </p>
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             {arrivalSegment.arrival.iataCode || "N/A"},{" "}
//                             {arrivalSegment.arrival.terminal
//                               ? `T${arrivalSegment.arrival.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right mt-2 sm:mt-0">
//                         <p className="text-xs sm:text-sm text-green-600 font-semibold">
//                           FILLING FAST
//                         </p>
//                         <p className="text-lg sm:text-xl font-bold text-gray-800">
//                           {currency === "GBP"
//                             ? "£"
//                             : currency === "EUR"
//                             ? "€"
//                             : "$"}
//                           {price}
//                         </p>
//                         <p className="text-xs sm:text-sm text-indigo-600">
//                           + Earn {rewards.toLocaleString("en-US")} Multifly
//                           Points
//                         </p>
//                         <button
//                           className="mt-2 bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 w-full sm:w-auto"
//                           onClick={() => handleBookNow(flight)}
//                           disabled={isLoading}
//                         >
//                           {isLoading ? "Processing..." : "Book Now"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-white text-lg sm:text-xl drop-shadow-md text-center py-6">
//                   No flights found with the applied filters.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center mt-6">
//               <Button
//                 className="bg-white hover:bg-white text-blue-800 py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md hover:shadow-lg transition duration-300"
//                 onClick={() => navigate("/")}
//               >
//                 Back to Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightResults;
//...........................................................................................................................

// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import FilterSection from "../section/FilterSection";
// import HorizontalSearchForm from "../section/HorizontalSearchForm";
// import BookingResponse from "../pages/BookingResponse";

// const FlightResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initialize state from location.state
//   const initialState = location.state || {};
//   const { flights = [], initialData = {} } = initialState;
//   const [originalFlights, setOriginalFlights] = useState(flights);
//   const [passengers, setPassengers] = useState(initialData.passengers || 1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filteredFlights, setFilteredFlights] = useState(originalFlights);
//   const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);

//   // Initialize searchFormData from initialData
//   const searchFormData = {
//     departure: initialData.departure || "",
//     destination: initialData.destination || "",
//     departureDate: initialData.departureDate || "",
//     returnDate: initialData.returnDate || "",
//     passengers: initialData.passengers || 1,
//   };

//   useEffect(() => {
//     if (JSON.stringify(filteredFlights) !== JSON.stringify(originalFlights)) {
//       setFilteredFlights(originalFlights);
//     }
//   }, [originalFlights]);

//   const formatDuration = (duration) => {
//     const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
//     if (!match) return duration.replace("PT", "").toLowerCase();
//     const hours = match[1].padStart(2, "0");
//     const minutes = match[2] ? match[2].padStart(2, "0") : "00";
//     return `${hours}h ${minutes}m`;
//   };

//   const calculateStops = (segments) => {
//     return segments.length - 1;
//   };

//   const calculateRewards = (price) => {
//     return Math.floor(price / 10);
//   };

//   const filterFlights = (criteria) => {
//     let result = [...originalFlights];
//     if (criteria.priceRange) {
//       result = result.filter(
//         (flight) => parseFloat(flight.price.grandTotal) <= criteria.priceRange
//       );
//     }
//     if (criteria.stops.length > 0) {
//       result = result.filter((flight) => {
//         const stopsCount = calculateStops(flight.itineraries[0].segments);
//         return (
//           (criteria.stops.includes("nonStop") && stopsCount === 0) ||
//           (criteria.stops.includes("oneStop") && stopsCount === 1) ||
//           (criteria.stops.includes("twoPlusStops") && stopsCount >= 2)
//         );
//       });
//     }
//     if (criteria.airlines.length > 0) {
//       result = result.filter((flight) =>
//         flight.validatingAirlineCodes.some((code) =>
//           criteria.airlines.includes(code)
//         )
//       );
//     }
//     if (criteria.departureTimes.length > 0) {
//       result = result.filter((flight) => {
//         const departureHour = new Date(
//           flight.itineraries[0].segments[0].departure.at
//         ).getUTCHours();
//         return (
//           (criteria.departureTimes.includes("morning") &&
//             departureHour >= 6 &&
//             departureHour < 12) ||
//           (criteria.departureTimes.includes("afternoon") &&
//             departureHour >= 12 &&
//             departureHour < 18) ||
//           (criteria.departureTimes.includes("evening") &&
//             departureHour >= 18 &&
//             departureHour < 24)
//         );
//       });
//     }
//     if (criteria.arrivalTimes.length > 0) {
//       result = result.filter((flight) => {
//         const lastSegment =
//           flight.itineraries[0].segments[
//             flight.itineraries[0].segments.length - 1
//           ];
//         const arrivalHour = new Date(lastSegment.arrival.at).getUTCHours();
//         return (
//           (criteria.arrivalTimes.includes("morning") &&
//             arrivalHour >= 6 &&
//             arrivalHour < 12) ||
//           (criteria.arrivalTimes.includes("afternoon") &&
//             arrivalHour >= 12 &&
//             arrivalHour < 18) ||
//           (criteria.arrivalTimes.includes("evening") &&
//             arrivalHour >= 18 &&
//             arrivalHour < 24)
//         );
//       });
//     }
//     setFilteredFlights(result);
//   };

//   const handleSearchUpdate = useCallback(
//     (newSearchData) => {
//       const isDifferent =
//         newSearchData.departure !== searchFormData.departure ||
//         newSearchData.destination !== searchFormData.destination ||
//         newSearchData.departureDate !== searchFormData.departureDate ||
//         newSearchData.returnDate !== searchFormData.returnDate ||
//         newSearchData.passengers !== searchFormData.passengers;

//       if (
//         isDifferent &&
//         newSearchData.flights &&
//         newSearchData.flights.length > 0
//       ) {
//         setOriginalFlights(newSearchData.flights);
//         setPassengers(newSearchData.passengers);
//         navigate("/flight-results", {
//           state: {
//             flights: newSearchData.flights,
//             initialData: {
//               departure: newSearchData.departure,
//               destination: newSearchData.destination,
//               departureDate: newSearchData.departureDate,
//               returnDate: newSearchData.returnDate,
//               passengers: newSearchData.passengers,
//             },
//           },
//           replace: true,
//         });
//       }
//     },
//     [
//       navigate,
//       searchFormData.departure,
//       searchFormData.destination,
//       searchFormData.departureDate,
//       searchFormData.returnDate,
//       searchFormData.passengers,
//     ]
//   );

//   const [isLoading, setIsLoading] = useState(false);

//   const handleBookNow = async (flight) => {
//     setIsLoading(true);
//     const departureSegment = flight.itineraries[0].segments[0];
//     const arrivalSegment =
//       flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//     const departureTime = new Date(departureSegment.departure.at).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//     const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//     const duration = formatDuration(flight.itineraries[0].duration);
//     const stops = calculateStops(flight.itineraries[0].segments);

//     const token = localStorage.getItem("auth_token");
//     console.log("Auth token:", token);
//     if (!token) {
//       alert("Please log in to book a flight.");
//       navigate("/login");
//       setIsLoading(false);
//       return;
//     }

//     const requestData = { flightOffer: flight };
//     console.log("Sending request data:", JSON.stringify(requestData, null, 2));

//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//       const response = await fetch(`${apiUrl}/api/flights/price`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       });

//       console.log("API response status:", response.status);
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API error response:", errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API response data:", data);

//       if (!data.pricedOffer) {
//         throw new Error("No priced offer returned from the API");
//       }

//       const transformedResponse = {
//         departure: departureSegment.departure,
//         arrival: arrivalSegment.arrival,
//         departureTime,
//         arrivalTime,
//         duration,
//         stops,
//         aircraft: "AIRBUS JET",
//         fare: parseFloat(data.pricedOffer.price.grandTotal) || 5387,
//         discount: 213.45,
//         insurance: 199,
//         additionalDiscount: 37.55,
//         totalAmount: parseFloat(data.pricedOffer.price.grandTotal) || 5335,
//       };

//       navigate("/booking", { state: { bookingResponse: transformedResponse } });
//     } catch (error) {
//       console.error("Error calling price API:", error.message);
//       alert("Failed to fetch price details. Please try again or contact support.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-200 w-full"
//       style={{
//         backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
//         {/* Toggle Button for Search Form */}
//         <button
//           className="sm:hidden w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
//           onClick={() => setIsSearchFormVisible(!isSearchFormVisible)}
//         >
//           {isSearchFormVisible ? "Hide Search" : "Show Search"}
//         </button>

//         {/* Search Form - Hidden on mobile by default */}
//         <div
//           className={`sticky top-0 z-50 bg-opacity-95 backdrop-blur-md ${
//             isSearchFormVisible ? "block" : "hidden sm:block"
//           }`}
//         >
//           <HorizontalSearchForm
//             initialData={searchFormData}
//             onSearch={handleSearchUpdate}
//           />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//           {/* Filters Section */}
//           <div className="lg:w-1/4 w-full lg:sticky lg:top-28 sm:top-24 top-20 z-40">
//             {/* Filter Panel for Mobile */}
//             <div
//               className={`lg:hidden fixed inset-x-0 top-0 w-full h-full bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-md z-50 transition-transform duration-300 transform ${
//                 isFilterOpen ? "translate-y-0" : "-translate-y-full"
//               }`}
//               style={{ maxHeight: "80vh", overflowY: "auto" }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold text-indigo-800">Filters</h2>
//                 <button
//                   className="bg-indigo-600 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
//                   onClick={() => setIsFilterOpen(false)}
//                 >
//                   Close Filters
//                 </button>
//               </div>
//               <FilterSection
//                 isOpen={isFilterOpen}
//                 onClose={() => setIsFilterOpen(false)}
//                 flights={originalFlights}
//                 onFilterChange={filterFlights}
//               />
//             </div>
//             {/* Toggle Button for Filters */}
//             <button
//               className="w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base lg:hidden"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//             >
//               {isFilterOpen ? "Close Filters" : "Open Filters"}
//             </button>
//             {/* Sidebar Filters for Larger Screens */}
//             <div className="hidden lg:block bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
//               <FilterSection
//                 isOpen={true} // Always open on lg and above
//                 onClose={() => setIsFilterOpen(false)}
//                 flights={originalFlights}
//                 onFilterChange={filterFlights}
//               />
//             </div>
//           </div>

//           {/* Flight Results Section */}
//           <div className="lg:w-3/4 w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-800 drop-shadow-lg">
//                 MultiflyTravel
//               </h1>
//               <div className="flex flex-col sm:flex-row sm:space-x-2 text-gray-700 mt-2 sm:mt-0 text-xs sm:text-sm lg:text-base">
//                 <p className="drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure
//                     .iataCode || "N/A"}{" "}
//                   -{" "}
//                   {filteredFlights[0]?.itineraries[0]?.segments[
//                     filteredFlights[0]?.itineraries[0]?.segments.length - 1
//                   ]?.arrival.iataCode || "N/A"}
//                 </p>
//                 <p className="drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
//                     ? new Date(
//                         filteredFlights[0].itineraries[0].segments[0].departure.at
//                       ).toLocaleDateString("en-US", {
//                         day: "numeric",
//                         month: "short",
//                       })
//                     : "N/A"}
//                 </p>
//                 <p className="drop-shadow-md">
//                   {passengers} Passenger{passengers !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)] overflow-y-auto space-y-2 sm:space-y-4 pr-1 sm:pr-2">
//               {filteredFlights.length > 0 ? (
//                 filteredFlights.map((flight, index) => {
//                   const departureSegment = flight.itineraries[0].segments[0];
//                   const arrivalSegment =
//                     flight.itineraries[0].segments[
//                       flight.itineraries[0].segments.length - 1
//                     ];
//                   const departureTime = departureSegment.departure.at
//                     ? new Date(departureSegment.departure.at).toLocaleTimeString(
//                         [],
//                         { hour: "2-digit", minute: "2-digit", hour12: false }
//                       )
//                     : "N/A";
//                   const arrivalTime = arrivalSegment.arrival.at
//                     ? new Date(arrivalSegment.arrival.at).toLocaleTimeString(
//                         [],
//                         { hour: "2-digit", minute: "2-digit", hour12: false }
//                       )
//                     : "N/A";
//                   const duration = flight.itineraries[0].duration
//                     ? formatDuration(flight.itineraries[0].duration)
//                     : "N/A";
//                   const stops = calculateStops(flight.itineraries[0].segments);
//                   const price = flight.price?.grandTotal
//                     ? parseFloat(flight.price.grandTotal).toLocaleString(
//                         "en-US",
//                         { minimumFractionDigits: 2, maximumFractionDigits: 2 }
//                       )
//                     : "N/A";
//                   const rewards = flight.price?.grandTotal
//                     ? calculateRewards(parseFloat(flight.price.grandTotal))
//                     : 0;
//                   const currency = flight.price?.currency || "USD";

//                   return (
//                     <div
//                       key={index}
//                       className="bg-white bg-opacity-95 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
//                     >
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
//                         <div className="flex space-x-1 sm:space-x-2">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <div
//                               key={idx}
//                               className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
//                             ></div>
//                           ))}
//                         </div>
//                         <div className="text-xs sm:text-sm text-gray-700 font-medium">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <span key={idx}>
//                               {code}{" "}
//                               {flight.itineraries[0].segments[idx]?.number ||
//                                 "N/A"}
//                               {idx < flight.validatingAirlineCodes.length - 1 &&
//                                 " + "}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-4 mt-1 sm:mt-0">
//                         <div className="text-center">
//                           <p className="text-base sm:text-lg font-bold text-gray-800">
//                             {departureTime}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {departureSegment.departure.iataCode || "N/A"},{" "}
//                             {departureSegment.departure.terminal
//                               ? `T${departureSegment.departure.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xs sm:text-sm text-gray-600 font-medium">
//                             {duration}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {stops} stop{stops !== 1 ? "s" : ""}
//                           </p>
//                           <div className="flex items-center justify-center mt-0.5 sm:mt-1">
//                             <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
//                             <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-indigo-500 rounded-full"></div>
//                             <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-base sm:text-lg font-bold text-gray-800">
//                             {arrivalTime}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {arrivalSegment.arrival.iataCode || "N/A"},{" "}
//                             {arrivalSegment.arrival.terminal
//                               ? `T${arrivalSegment.arrival.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right mt-1 sm:mt-0">
//                         <p className="text-xs sm:text-sm text-green-600 font-semibold">
//                           FILLING FAST
//                         </p>
//                         <p className="text-base sm:text-lg font-bold text-gray-800">
//                           {currency === "GBP"
//                             ? "$"
//                             : currency === "EUR"
//                             ? "$"
//                             : "$"}
//                           {price}
//                         </p>
//                         <p className="text-xs sm:text-sm text-indigo-600">
//                           + Earn {rewards.toLocaleString("en-US")} Multifly
//                           Points
//                         </p>
//                         <button
//                           className="mt-1 sm:mt-2 bg-gray-200 text-black py-1 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-300 transition duration-200 w-full sm:w-auto text-xs sm:text-sm"
//                           onClick={() => handleBookNow(flight)}
//                           disabled={isLoading}
//                         >
//                           {isLoading ? "Processing..." : "Book Now"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-white text-base sm:text-lg drop-shadow-md text-center py-4">
//                   No flights found with the applied filters.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center mt-4 sm:mt-6">
//               <Button
//                 className="bg-blue-800 hover:bg-blue-800 text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 text-sm sm:text-base"
//                 onClick={() => navigate("/")}
//               >
//                 Back to Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightResults;

// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import FilterSection from "../section/FilterSection";
// import HorizontalSearchForm from "../section/HorizontalSearchForm";
// import BookingResponse from "../pages/BookingResponse";

// const FlightResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initialize state from location.state
//   const initialState = location.state || {};
//   const { flights = [], initialData = {} } = initialState;
//   const [originalFlights, setOriginalFlights] = useState(flights);
//   const [passengers, setPassengers] = useState(initialData.passengers || 1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filteredFlights, setFilteredFlights] = useState(originalFlights);
//   const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);
//   // Use an object to track loading state for each flight
//   const [loadingStates, setLoadingStates] = useState({});

//   // Initialize searchFormData from initialData
//   const searchFormData = {
//     departure: initialData.departure || "",
//     destination: initialData.destination || "",
//     departureDate: initialData.departureDate || "",
//     returnDate: initialData.returnDate || "",
//     passengers: initialData.passengers || 1,
//   };

//   useEffect(() => {
//     if (JSON.stringify(filteredFlights) !== JSON.stringify(originalFlights)) {
//       setFilteredFlights(originalFlights);
//     }
//   }, [originalFlights]);

//   const formatDuration = (duration) => {
//     const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
//     if (!match) return duration.replace("PT", "").toLowerCase();
//     const hours = match[1].padStart(2, "0");
//     const minutes = match[2] ? match[2].padStart(2, "0") : "00";
//     return `${hours}h ${minutes}m`;
//   };

//   const calculateStops = (segments) => {
//     return segments.length - 1;
//   };

//   const calculateRewards = (price) => {
//     return Math.floor(price / 10);
//   };

//   const filterFlights = (criteria) => {
//     let result = [...originalFlights];
//     if (criteria.priceRange) {
//       result = result.filter(
//         (flight) => parseFloat(flight.price.grandTotal) <= criteria.priceRange
//       );
//     }
//     if (criteria.stops.length > 0) {
//       result = result.filter((flight) => {
//         const stopsCount = calculateStops(flight.itineraries[0].segments);
//         return (
//           (criteria.stops.includes("nonStop") && stopsCount === 0) ||
//           (criteria.stops.includes("oneStop") && stopsCount === 1) ||
//           (criteria.stops.includes("twoPlusStops") && stopsCount >= 2)
//         );
//       });
//     }
//     if (criteria.airlines.length > 0) {
//       result = result.filter((flight) =>
//         flight.validatingAirlineCodes.some((code) =>
//           criteria.airlines.includes(code)
//         )
//       );
//     }
//     if (criteria.departureTimes.length > 0) {
//       result = result.filter((flight) => {
//         const departureHour = new Date(
//           flight.itineraries[0].segments[0].departure.at
//         ).getUTCHours();
//         return (
//           (criteria.departureTimes.includes("morning") &&
//             departureHour >= 6 &&
//             departureHour < 12) ||
//           (criteria.departureTimes.includes("afternoon") &&
//             departureHour >= 12 &&
//             departureHour < 18) ||
//           (criteria.departureTimes.includes("evening") &&
//             departureHour >= 18 &&
//             departureHour < 24)
//         );
//       });
//     }
//     if (criteria.arrivalTimes.length > 0) {
//       result = result.filter((flight) => {
//         const lastSegment =
//           flight.itineraries[0].segments[
//             flight.itineraries[0].segments.length - 1
//           ];
//         const arrivalHour = new Date(lastSegment.arrival.at).getUTCHours();
//         return (
//           (criteria.arrivalTimes.includes("morning") &&
//             arrivalHour >= 6 &&
//             arrivalHour < 12) ||
//           (criteria.arrivalTimes.includes("afternoon") &&
//             arrivalHour >= 12 &&
//             arrivalHour < 18) ||
//           (criteria.arrivalTimes.includes("evening") &&
//             arrivalHour >= 18 &&
//             arrivalHour < 24)
//         );
//       });
//     }
//     setFilteredFlights(result);
//   };

//   const handleSearchUpdate = useCallback(
//     (newSearchData) => {
//       const isDifferent =
//         newSearchData.departure !== searchFormData.departure ||
//         newSearchData.destination !== searchFormData.destination ||
//         newSearchData.departureDate !== searchFormData.departureDate ||
//         newSearchData.returnDate !== searchFormData.returnDate ||
//         newSearchData.passengers !== searchFormData.passengers;

//       if (
//         isDifferent &&
//         newSearchData.flights &&
//         newSearchData.flights.length > 0
//       ) {
//         setOriginalFlights(newSearchData.flights);
//         setPassengers(newSearchData.passengers);
//         navigate("/flight-results", {
//           state: {
//             flights: newSearchData.flights,
//             initialData: {
//               departure: newSearchData.departure,
//               destination: newSearchData.destination,
//               departureDate: newSearchData.departureDate,
//               returnDate: newSearchData.returnDate,
//               passengers: newSearchData.passengers,
//             },
//           },
//           replace: true,
//         });
//       }
//     },
//     [
//       navigate,
//       searchFormData.departure,
//       searchFormData.destination,
//       searchFormData.departureDate,
//       searchFormData.returnDate,
//       searchFormData.passengers,
//     ]
//   );

//   const handleBookNow = async (flight, index) => {
//     // Set loading state for this specific flight
//     setLoadingStates((prev) => ({ ...prev, [index]: true }));

//     const departureSegment = flight.itineraries[0].segments[0];
//     const arrivalSegment =
//       flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//     const departureTime = new Date(departureSegment.departure.at).toLocaleTimeString(
//       [],
//       {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       }
//     );
//     const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString(
//       [],
//       {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       }
//     );
//     const duration = formatDuration(flight.itineraries[0].duration);
//     const stops = calculateStops(flight.itineraries[0].segments);

//     const token = localStorage.getItem("auth_token");
//     console.log("Auth token:", token);
//     if (!token) {
//       alert("Please log in to book a flight.");
//       navigate("/login");
//       setLoadingStates((prev) => ({ ...prev, [index]: false }));
//       return;
//     }

//     const requestData = { flightOffer: flight };
//     console.log("Sending request data:", JSON.stringify(requestData, null, 2));

//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//       const response = await fetch(`${apiUrl}/api/flights/price`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       });

//       console.log("API response status:", response.status);
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API error response:", errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API response data:", data);

//       if (!data.pricedOffer) {
//         throw new Error("No priced offer returned from the API");
//       }

//       const transformedResponse = {
//         departure: departureSegment.departure,
//         arrival: arrivalSegment.arrival,
//         departureTime,
//         arrivalTime,
//         duration,
//         stops,
//         aircraft: "AIRBUS JET",
//         fare: parseFloat(data.pricedOffer.price.grandTotal) || 5387,
//         discount: 213.45,
//         insurance: 199,
//         additionalDiscount: 37.55,
//         totalAmount: parseFloat(data.pricedOffer.price.grandTotal) || 5335,
//       };

//       navigate("/booking", { state: { bookingResponse: transformedResponse } });
//     } catch (error) {
//       console.error("Error calling price API:", error.message);
//       alert("Failed to fetch price details. Please try again or contact support.");
//     } finally {
//       // Reset loading state for this specific flight
//       setLoadingStates((prev) => ({ ...prev, [index]: false }));
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-200 w-full"
//       style={{
//         backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
//         {/* Toggle Button for Search Form */}
//         <button
//           className="sm:hidden w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
//           onClick={() => setIsSearchFormVisible(!isSearchFormVisible)}
//         >
//           {isSearchFormVisible ? "Hide Search" : "Show Search"}
//         </button>

//         {/* Search Form - Hidden on mobile by default */}
//         <div
//           className={`sticky top-0 z-50 bg-opacity-95 backdrop-blur-md ${
//             isSearchFormVisible ? "block" : "hidden sm:block"
//           }`}
//         >
//           <HorizontalSearchForm
//             initialData={searchFormData}
//             onSearch={handleSearchUpdate}
//           />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//           {/* Filters Section */}
//           <div className="lg:w-1/4 w-full lg:sticky lg:top-28 sm:top-24 top-20 z-40">
//             {/* Filter Panel for Mobile */}
//             <div
//               className={`lg:hidden fixed inset-x-0 top-0 w-full h-full bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-md z-50 transition-transform duration-300 transform ${
//                 isFilterOpen ? "translate-y-0" : "-translate-y-full"
//               }`}
//               style={{ maxHeight: "80vh", overflowY: "auto" }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold text-indigo-800">Filters</h2>
//                 <button
//                   className="bg-indigo-600 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
//                   onClick={() => setIsFilterOpen(false)}
//                 >
//                   Close Filters
//                 </button>
//               </div>
//               <FilterSection
//                 isOpen={isFilterOpen}
//                 onClose={() => setIsFilterOpen(false)}
//                 flights={originalFlights}
//                 onFilterChange={filterFlights}
//               />
//             </div>
//             {/* Toggle Button for Filters */}
//             <button
//               className="w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base lg:hidden"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//             >
//               {isFilterOpen ? "Close Filters" : "Open Filters"}
//             </button>
//             {/* Sidebar Filters for Larger Screens */}
//             <div className="hidden lg:block bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
//               <FilterSection
//                 isOpen={true} // Always open on lg and above
//                 onClose={() => setIsFilterOpen(false)}
//                 flights={originalFlights}
//                 onFilterChange={filterFlights}
//               />
//             </div>
//           </div>

//           {/* Flight Results Section */}
//           <div className="lg:w-3/4 w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-800 drop-shadow-lg">
//                 MultiflyTravel
//               </h1>
//               <div className="flex flex-col sm:flex-row sm:space-x-2 text-gray-700 mt-2 sm:mt-0 text-xs sm:text-sm lg:text-base">
//                 <p className="drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure
//                     .iataCode || "N/A"}{" "}
//                   -{" "}
//                   {filteredFlights[0]?.itineraries[0]?.segments[
//                     filteredFlights[0]?.itineraries[0]?.segments.length - 1
//                   ]?.arrival.iataCode || "N/A"}
//                 </p>
//                 <p className="drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
//                     ? new Date(
//                         filteredFlights[0].itineraries[0].segments[0].departure.at
//                       ).toLocaleDateString("en-US", {
//                         day: "numeric",
//                         month: "short",
//                       })
//                     : "N/A"}
//                 </p>
//                 <p className="drop-shadow-md">
//                   {passengers} Passenger{passengers !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)] overflow-y-auto space-y-2 sm:space-y-4 pr-1 sm:pr-2">
//               {filteredFlights.length > 0 ? (
//                 filteredFlights.map((flight, index) => {
//                   const departureSegment = flight.itineraries[0].segments[0];
//                   const arrivalSegment =
//                     flight.itineraries[0].segments[
//                       flight.itineraries[0].segments.length - 1
//                     ];
//                   const departureTime = departureSegment.departure.at
//                     ? new Date(departureSegment.departure.at).toLocaleTimeString(
//                         [],
//                         { hour: "2-digit", minute: "2-digit", hour12: false }
//                       )
//                     : "N/A";
//                   const arrivalTime = arrivalSegment.arrival.at
//                     ? new Date(arrivalSegment.arrival.at).toLocaleTimeString(
//                         [],
//                         { hour: "2-digit", minute: "2-digit", hour12: false }
//                       )
//                     : "N/A";
//                   const duration = flight.itineraries[0].duration
//                     ? formatDuration(flight.itineraries[0].duration)
//                     : "N/A";
//                   const stops = calculateStops(flight.itineraries[0].segments);
//                   const price = flight.price?.grandTotal
//                     ? parseFloat(flight.price.grandTotal).toLocaleString(
//                         "en-US",
//                         { minimumFractionDigits: 2, maximumFractionDigits: 2 }
//                       )
//                     : "N/A";
//                   const rewards = flight.price?.grandTotal
//                     ? calculateRewards(parseFloat(flight.price.grandTotal))
//                     : 0;
//                   const currency = flight.price?.currency || "USD";

//                   return (
//                     <div
//                       key={index}
//                       className="bg-white bg-opacity-95 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
//                     >
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
//                         <div className="flex space-x-1 sm:space-x-2">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <div
//                               key={idx}
//                               className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
//                             ></div>
//                           ))}
//                         </div>
//                         <div className="text-xs sm:text-sm text-gray-700 font-medium">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <span key={idx}>
//                               {code}{" "}
//                               {flight.itineraries[0].segments[idx]?.number ||
//                                 "N/A"}
//                               {idx < flight.validatingAirlineCodes.length - 1 &&
//                                 " + "}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-4 mt-1 sm:mt-0">
//                         <div className="text-center">
//                           <p className="text-base sm:text-lg font-bold text-gray-800">
//                             {departureTime}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {departureSegment.departure.iataCode || "N/A"},{" "}
//                             {departureSegment.departure.terminal
//                               ? `T${departureSegment.departure.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xs sm:text-sm text-gray-600 font-medium">
//                             {duration}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {stops} stop{stops !== 1 ? "s" : ""}
//                           </p>
//                           <div className="flex items-center justify-center mt-0.5 sm:mt-1">
//                             <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
//                             <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-indigo-500 rounded-full"></div>
//                             <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-base sm:text-lg font-bold text-gray-800">
//                             {arrivalTime}
//                           </p>
//                           <p className="text-xs text-gray-600">
//                             {arrivalSegment.arrival.iataCode || "N/A"},{" "}
//                             {arrivalSegment.arrival.terminal
//                               ? `T${arrivalSegment.arrival.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right mt-1 sm:mt-0">
//                         <p className="text-xs sm:text-sm text-green-600 font-semibold">
//                           FILLING FAST
//                         </p>
//                         <p className="text-base sm:text-lg font-bold text-gray-800">
//                           {currency === "GBP"
//                             ? "$"
//                             : currency === "EUR"
//                             ? "$"
//                             : "$"}
//                           {price}
//                         </p>
//                         <p className="text-xs sm:text-sm text-indigo-600">
//                           + Earn {rewards.toLocaleString("en-US")} Multifly
//                           Points
//                         </p>
//                         <button
//                           className="mt-1 sm:mt-2 bg-gray-200 text-black py-1 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-300 transition duration-200 w-full sm:w-auto text-xs sm:text-sm"
//                           onClick={() => handleBookNow(flight, index)}
//                           disabled={loadingStates[index] || false}
//                         >
//                           {loadingStates[index] ? "Processing..." : "Book Now"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-white text-base sm:text-lg drop-shadow-md text-center py-4">
//                   No flights found with the applied filters.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center mt-4 sm:mt-6">
//               <Button
//                 className="bg-blue-800 hover:bg-blue-800 text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 text-sm sm:text-base"
//                 onClick={() => navigate("/")}
//               >
//                 Back to Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightResults;


import React, { useState, useEffect, useCallback, useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FilterSection from "../section/FilterSection";
import HorizontalSearchForm from "../section/HorizontalSearchForm";
import BookingResponse from "../pages/BookingResponse";
import { priceFlight } from "../services/apiService";
import { CountryContext } from "../context/CountryContext";

// Static exchange rates (base currency: USD)
// In a real app, fetch these rates from an API
const EXCHANGE_RATES = {
  USD: 1,        // 1 USD = 1 USD
  INR: 83.50,    // 1 USD = 83.50 INR
  EUR: 0.92,     // 1 USD = 0.92 EUR
};

// Currency symbols
const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  EUR: "€",
};

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCountry } = useContext(CountryContext); // Access selectedCountry from CountryContext
  // Initialize state from location.state
  const initialState = location.state || {};
  const { flights = [], initialData = {} } = initialState;
  const [originalFlights, setOriginalFlights] = useState(flights);
  const [passengers, setPassengers] = useState(initialData.passengers || 1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState(originalFlights);
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);
  // Use an object to track loading state for each flight
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize searchFormData from initialData
  const searchFormData = {
    departure: initialData.departure || "",
    destination: initialData.destination || "",
    departureDate: initialData.departureDate || "",
    returnDate: initialData.returnDate || "",
    passengers: initialData.passengers || 1,
  };

  useEffect(() => {
    if (JSON.stringify(filteredFlights) !== JSON.stringify(originalFlights)) {
      setFilteredFlights(originalFlights);
    }
  }, [originalFlights]);

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    const hours = match[1].padStart(2, "0");
    const minutes = match[2] ? match[2].padStart(2, "0") : "00";
    return `${hours}h ${minutes}m`;
  };

  const calculateStops = (segments) => {
    return segments.length - 1;
  };

  const calculateRewards = (price) => {
    return Math.floor(price / 10);
  };
  // Function to convert price to the selected currency
  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (!price || isNaN(price)) return 0;

    // Convert price to USD if the source currency is different
    let priceInUSD = price;
    if (fromCurrency !== "USD") {
      // If the API returns a price in a different currency, convert it to USD first
      // For simplicity, assuming the API returns prices in USD
      // In a real app, you'd need to handle this based on the actual API response
      priceInUSD = price / EXCHANGE_RATES[fromCurrency];
    }

    // Convert from USD to the target currency
    const exchangeRate = EXCHANGE_RATES[toCurrency] || 1; // Default to 1 if currency not found
    const convertedPrice = priceInUSD * exchangeRate;

    return convertedPrice;
  };

  const filterFlights = (criteria) => {
    let result = [...originalFlights];

    // Price Range Filter
    if (criteria.priceRange && criteria.priceRange > 0) {
      result = result.filter(
        (flight) => parseFloat(flight.price.grandTotal) <= criteria.priceRange
      );
    }

    // Stops Filter
    if (criteria.stops && criteria.stops.length > 0) {
      result = result.filter((flight) => {
        const stopsCount = calculateStops(flight.itineraries[0].segments);
        return criteria.stops.some((stopType) => {
          if (stopType === "nonStop" && stopsCount === 0) return true;
          if (stopType === "oneStop" && stopsCount === 1) return true;
          if (stopType === "twoPlusStops" && stopsCount >= 2) return true;
          return false;
        });
      });
    }

    // Airlines Filter
    if (criteria.airlines && criteria.airlines.length > 0) {
      result = result.filter((flight) =>
        flight.validatingAirlineCodes.some((code) =>
          criteria.airlines.includes(code)
        )
      );
    }

    // Departure Time Filter
    if (criteria.departureTimes && criteria.departureTimes.length > 0) {
      result = result.filter((flight) => {
        const departureDate = new Date(
          flight.itineraries[0].segments[0].departure.at
        );
        // Skip if departure time is invalid
        if (isNaN(departureDate.getTime())) return false;
        const departureHour = departureDate.getUTCHours(); // Use getUTCHours for UTC; switch to getHours for local time if needed
        return criteria.departureTimes.some((time) => {
          if (time === "morning" && departureHour >= 6 && departureHour < 12)
            return true;
          if (time === "afternoon" && departureHour >= 12 && departureHour < 18)
            return true;
          if (time === "evening" && departureHour >= 18 && departureHour < 24)
            return true;
          if (time === "night" && departureHour >= 0 && departureHour < 6)
            return true;
          return false;
        });
      });
    }

    // Arrival Time Filter
    if (criteria.arrivalTimes && criteria.arrivalTimes.length > 0) {
      result = result.filter((flight) => {
        const lastSegment =
          flight.itineraries[0].segments[
            flight.itineraries[0].segments.length - 1
          ];
        const arrivalDate = new Date(lastSegment.arrival.at);
        // Skip if arrival time is invalid
        if (isNaN(arrivalDate.getTime())) return false;
        const arrivalHour = arrivalDate.getUTCHours(); // Use getUTCHours for UTC; switch to getHours for local time if needed
        return criteria.arrivalTimes.some((time) => {
          if (time === "morning" && arrivalHour >= 6 && arrivalHour < 12)
            return true;
          if (time === "afternoon" && arrivalHour >= 12 && arrivalHour < 18)
            return true;
          if (time === "evening" && arrivalHour >= 18 && arrivalHour < 24)
            return true;
          if (time === "night" && arrivalHour >= 0 && arrivalHour < 6)
            return true;
          return false;
        });
      });
    }

    setFilteredFlights(result);
  };

  const handleSearchUpdate = useCallback(
    (newSearchData) => {
      const isDifferent =
        newSearchData.departure !== searchFormData.departure ||
        newSearchData.destination !== searchFormData.destination ||
        newSearchData.departureDate !== searchFormData.departureDate ||
        newSearchData.returnDate !== searchFormData.returnDate ||
        newSearchData.passengers !== searchFormData.passengers;

      if (
        isDifferent &&
        newSearchData.flights &&
        newSearchData.flights.length > 0
      ) {
        setOriginalFlights(newSearchData.flights);
        setPassengers(newSearchData.passengers);
        navigate("/flight-results", {
          state: {
            flights: newSearchData.flights,
            initialData: {
              departure: newSearchData.departure,
              destination: newSearchData.destination,
              departureDate: newSearchData.departureDate,
              returnDate: newSearchData.returnDate,
              passengers: newSearchData.passengers,
            },
          },
          replace: true,
        });
      }
    },
    [
      navigate,
      searchFormData.departure,
      searchFormData.destination,
      searchFormData.departureDate,
      searchFormData.returnDate,
      searchFormData.passengers,
    ]
  );

  const handleBookNow = async (flight, index) => {
    // Set loading state for this specific flight
    setLoadingStates((prev) => ({ ...prev, [index]: true }));

    const departureSegment = flight.itineraries[0].segments[0];
    const arrivalSegment =
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
    const departureTime = new Date(
      departureSegment.departure.at
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );
    const duration = formatDuration(flight.itineraries[0].duration);
    const stops = calculateStops(flight.itineraries[0].segments);

    const token = localStorage.getItem("vendor_token");
    console.log("Auth token:", token);
    if (!token) {
      alert("Please log in to book a flight.");
      navigate("/BookingResponse");
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
      return;
    }

    const requestData = { flightOffer: flight };
    console.log("Sending request data:", JSON.stringify(requestData, null, 2));

    // try {
    //   const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    //   const response = await fetch(`${apiUrl}/api/flights/price`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(requestData),
    //   });

    //   console.log("API response status:", response.status);
    //   if (!response.ok) {
    //     const errorText = await response.text();
    //     console.error("API error response:", errorText);
    //     throw new Error(
    //       `HTTP error! status: ${response.status}, message: ${errorText}`
    //     );
    //   }

    //   const data = await response.json();
    //   console.log("API response data:", data);

    //   if (!data.pricedOffer) {
    //     throw new Error("No priced offer returned from the API");
    //   }

    //   const transformedResponse = {
    //     departure: departureSegment.departure,
    //     arrival: arrivalSegment.arrival,
    //     departureTime,
    //     arrivalTime,
    //     duration,
    //     stops,
    //     aircraft: "AIRBUS JET",
    //     fare: parseFloat(data.pricedOffer.price.grandTotal) || 5387,
    //     discount: 213.45,
    //     insurance: 199,
    //     additionalDiscount: 37.55,
    //     totalAmount: parseFloat(data.pricedOffer.price.grandTotal) || 5335,
    //   };

    //   navigate("/booking", { state: { bookingResponse: transformedResponse } });
    // } 
    try {
      const data = await priceFlight(flight);
      console.log("API response data:", data);

      if (!data.pricedOffer) {
        throw new Error("No priced offer returned from the API");
      }
      // Convert the prices for the booking response
      const fareInSelectedCurrency = convertPrice(
        parseFloat(data.pricedOffer.price.grandTotal) || 5387,
        "USD",
        selectedCountry.currency_code
      );
      const discountInSelectedCurrency = convertPrice(213.45, "USD", selectedCountry.currency_code);
      const insuranceInSelectedCurrency = convertPrice(199, "USD", selectedCountry.currency_code);
      const additionalDiscountInSelectedCurrency = convertPrice(37.55, "USD", selectedCountry.currency_code);
      const totalAmountInSelectedCurrency = convertPrice(
        parseFloat(data.pricedOffer.price.grandTotal) || 5335,
        "USD",
        selectedCountry.currency_code
      );
      // const transformedResponse = {
      //   departure: departureSegment.departure,
      //   arrival: arrivalSegment.arrival,
      //   departureTime,
      //   arrivalTime,
      //   duration,
      //   stops,
      //   aircraft: "AIRBUS JET",
      //   fare: parseFloat(data.pricedOffer.price.grandTotal) || 5387,
      //   discount: 213.45,
      //   insurance: 199,
      //   additionalDiscount: 37.55,
      //   totalAmount: parseFloat(data.pricedOffer.price.grandTotal) || 5335,
      // };
      const transformedResponse = {
        departure: departureSegment.departure,
        arrival: arrivalSegment.arrival,
        departureTime,
        arrivalTime,
        duration,
        stops,
        aircraft: "AIRBUS JET",
        fare: fareInSelectedCurrency,
        discount: discountInSelectedCurrency,
        insurance: insuranceInSelectedCurrency,
        additionalDiscount: additionalDiscountInSelectedCurrency,
        totalAmount: totalAmountInSelectedCurrency,
        currency: selectedCountry.currency_code, // Pass the currency code to the booking page
      };

      navigate("/booking", { state: { bookingResponse: transformedResponse } });
    } catch (error) {
      console.error("Error calling price API:", error.message);
      alert("Failed to fetch price details. Please try again or contact support.");
    } finally {
      // Reset loading state for this specific flight
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-200 w-full"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {/* Toggle Button for Search Form */}
        <button
          className="sm:hidden w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
          onClick={() => setIsSearchFormVisible(!isSearchFormVisible)}
        >
          {isSearchFormVisible ? "Hide Search" : "Show Search"}
        </button>

        {/* Search Form - Hidden on mobile by default */}
        <div
          className={`sticky top-0 z-50 bg-opacity-95 backdrop-blur-md ${
            isSearchFormVisible ? "block" : "hidden sm:block"
          }`}
        >
          <HorizontalSearchForm
            initialData={searchFormData}
            onSearch={handleSearchUpdate}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Section */}
          <div className="lg:w-1/4 w-full lg:sticky lg:top-28 sm:top-24 top-20 z-40">
            {/* Filter Panel for Mobile */}
            <div
              className={`lg:hidden fixed inset-x-0 top-0 w-full h-full bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-md z-50 transition-transform duration-300 transform ${
                isFilterOpen ? "translate-y-0" : "-translate-y-full"
              }`}
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-indigo-800">Filters</h2>
                <button
                  className="bg-indigo-600 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Close Filters
                </button>
              </div>
              <FilterSection
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                flights={originalFlights}
                onFilterChange={filterFlights}
              />
            </div>
            {/* Toggle Button for Filters */}
            <button
              className="w-full bg-indigo-600 text-white py-1 px-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base lg:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? "Close Filters" : "Open Filters"}
            </button>
            {/* Sidebar Filters for Larger Screens */}
            <div className="hidden lg:block bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
              <FilterSection
                isOpen={true} // Always open on lg and above
                onClose={() => setIsFilterOpen(false)}
                flights={originalFlights}
                onFilterChange={filterFlights}
              />
            </div>
          </div>

          {/* Flight Results Section */}
          <div className="lg:w-3/4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-800 drop-shadow-lg">
                MultiflyTravel
              </h1>
              <div className="flex flex-col sm:flex-row sm:space-x-2 text-gray-700 mt-2 sm:mt-0 text-xs sm:text-sm lg:text-base">
                <p className="drop-shadow-md">
                  {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure
                    .iataCode || "N/A"}{" "}
                  -{" "}
                  {filteredFlights[0]?.itineraries[0]?.segments[
                    filteredFlights[0]?.itineraries[0]?.segments.length - 1
                  ]?.arrival.iataCode || "N/A"}
                </p>
                <p className="drop-shadow-md">
                  {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
                    ? new Date(
                        filteredFlights[0].itineraries[0].segments[0].departure.at
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })
                    : "N/A"}
                </p>
                <p className="drop-shadow-md">
                  {passengers} Passenger{passengers !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)] overflow-y-auto space-y-2 sm:space-y-4 pr-1 sm:pr-2">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => {
                  const departureSegment = flight.itineraries[0].segments[0];
                  const arrivalSegment =
                    flight.itineraries[0].segments[
                      flight.itineraries[0].segments.length - 1
                    ];
                  const departureTime = departureSegment.departure.at
                    ? new Date(departureSegment.departure.at).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit", hour12: false }
                      )
                    : "N/A";
                  const arrivalTime = arrivalSegment.arrival.at
                    ? new Date(arrivalSegment.arrival.at).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit", hour12: false }
                      )
                    : "N/A";
                  const duration = flight.itineraries[0].duration
                    ? formatDuration(flight.itineraries[0].duration)
                    : "N/A";
                  const stops = calculateStops(flight.itineraries[0].segments);
                  const price = flight.price?.grandTotal
                    ? parseFloat(flight.price.grandTotal).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )
                    : "N/A";
                  const rewards = flight.price?.grandTotal
                    ? calculateRewards(parseFloat(flight.price.grandTotal))
                    : 0;
                  const currency = flight.price?.currency || "USD";

                  return (
                    <div
                      key={index}
                      className="bg-white bg-opacity-95 backdrop-blur-md p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <div className="flex space-x-1 sm:space-x-2">
                          {flight.validatingAirlineCodes.map((code, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
                            ></div>
                          ))}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 font-medium">
                          {flight.validatingAirlineCodes.map((code, idx) => (
                            <span key={idx}>
                              {code}{" "}
                              {flight.itineraries[0].segments[idx]?.number ||
                                "N/A"}
                              {idx < flight.validatingAirlineCodes.length - 1 &&
                                " + "}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-4 mt-1 sm:mt-0">
                        <div className="text-center">
                          <p className="text-base sm:text-lg font-bold text-gray-800">
                            {departureTime}
                          </p>
                          <p className="text-xs text-gray-600">
                            {departureSegment.departure.iataCode || "N/A"},{" "}
                            {departureSegment.departure.terminal
                              ? `T${departureSegment.departure.terminal}`
                              : "T N/A"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">
                            {duration}
                          </p>
                          <p className="text-xs text-gray-500">
                            {stops} stop{stops !== 1 ? "s" : ""}
                          </p>
                          <div className="flex items-center justify-center mt-0.5 sm:mt-1">
                            <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-indigo-500 rounded-full"></div>
                            <div className="h-px w-3 sm:w-6 bg-gray-400"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-base sm:text-lg font-bold text-gray-800">
                            {arrivalTime}
                          </p>
                          <p className="text-xs text-gray-600">
                            {arrivalSegment.arrival.iataCode || "N/A"},{" "}
                            {arrivalSegment.arrival.terminal
                              ? `T${arrivalSegment.arrival.terminal}`
                              : "T N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right mt-1 sm:mt-0">
                        <p className="text-xs sm:text-sm text-green-600 font-semibold">
                          FILLING FAST
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-800">
                          {currency === "GBP"
                            ? "$"
                            : currency === "EUR"
                            ? "$"
                            : "$"}
                          {price}
                        </p>
                        <p className="text-xs sm:text-sm text-indigo-600">
                          + Earn {rewards.toLocaleString("en-US")} Multifly
                          Points
                        </p>
                        <button
                          className="mt-1 sm:mt-2 bg-gray-200 text-black py-1 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-300 transition duration-200 w-full sm:w-auto text-xs sm:text-sm"
                          onClick={() => handleBookNow(flight, index)}
                          disabled={loadingStates[index] || false}
                        >
                          {loadingStates[index] ? "Processing..." : "Book Now"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-white text-base sm:text-lg drop-shadow-md text-center py-4">
                  No flights found with the applied filters.
                </p>
              )}
            </div>

            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                className="bg-blue-800 hover:bg-blue-800 text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 text-sm sm:text-base"
                onClick={() => navigate("/")}
              >
                Back to Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;