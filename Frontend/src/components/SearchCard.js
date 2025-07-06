
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import FlightBooking from "./FlightBooking";

const SearchCard = () => {
  const [showFlightBooking, setShowFlightBooking] = useState(false);

  return (
    <div className="flex flex-col">
      <AnimatePresence mode="wait">
        {!showFlightBooking ? (
          <motion.div
            key="searchCard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 text-center">
              Where to?
            </div>
            <div className="w-full max-w-[350px] sm:max-w-[500px] lg:max-w-[600px] h-auto bg-white shadow-xl rounded-2xl p-4 sm:p-8 space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full py-3 pl-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
                  onFocus={() => setShowFlightBooking(true)}
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                  onClick={() => setShowFlightBooking(true)}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="flightBooking"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <FlightBooking />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchCard;