
// import FlightSearchCard from "./FlightSearchCard";

// export default function FlightBooking() {
//   return (
//     <div className="flex flex-col">
//       <div className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 text-center">
//         Book a flight
//       </div>
//       <div className="flex justify-center">
//         <FlightSearchCard />
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import FlightSearchCard from "./FlightSearchCard";

export default function FlightBooking() {
  const [activeTab, setActiveTab] = useState("Flights");

  const getTitle = () => {
    switch (activeTab) {
      case "Flights":
        return "Book a flight";
      case "Hotels":
        return "Book a hotel";
      case "Room blocks":
        return "Book a room block";
      case "Trains":
        return "Book a train";
      case "Rental cars":
        return "Book a rental car";
      default:
        return "Book a service";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 text-center">
        {getTitle()}
      </div>
      <div className="flex justify-center">
        <FlightSearchCard activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
