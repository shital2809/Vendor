

import React, { useState } from "react";
import { Search, User, Calendar, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import SalesReport from "../components/SalesReport";
import TopAirlines from "../components/TopAirlines";
import TopSectors from "../components/TopSectors";
import MonthlySales from "../components/MontlySales";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("sales");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const navigate = useNavigate();
  const displayedMonth = calendarDate.getMonth();
  const displayedYear = calendarDate.getFullYear();
  const firstDayIndex = new Date(displayedYear, displayedMonth, 1).getDay();
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const today = new Date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCalendarDate(new Date(displayedYear, displayedMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(displayedYear, displayedMonth + 1, 1));
  };

  const navigateToHome = () => {
    navigate('/');
  };
  return (
    <section className="bg-gray-200 min-h-screen w-full">
      <Navbar />
      <div className="p-4 sm:p-6 md:p-8">
      <div className="block lg:hidden mb-4">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
          >
            <div
              // className="w-12 h-12 rounded-full flex items-center justify-center"
              // style={{ backgroundColor: '#B0BEC5' }}
            >
              <span className="text-black text-sm">
                <ArrowLeft />
              </span>
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
        {/* Dashboard Header - Hidden on mobile, visible on larger screens */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Left Main Section */}
          <div className="space-y-6 lg:ml-[50px]">
            <SalesReport />
            <div>
              <h2 className="text-xl md:text-2xl font-semibold relative inline-block mb-4 ml-4 sm:ml-12">
                Top 5 TopAirlines
                <span className="block h-1 bg-yellow-400 w-full absolute bottom-0 left-0"></span>
              </h2>
              <TopAirlines />
            </div>

            {/* Top 5 Sectors */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold relative inline-block mb-4 ml-4 sm:ml-12">
                Top 5 Sectors
                <span className="block h-1 bg-yellow-400 w-full absolute bottom-0 left-0"></span>
              </h2>
              <TopSectors />
            </div>

            {/* Monthly Sales / Revenue */}
            <div>
              <div className="flex space-x-4 border-b-2 border-gray-200 mb-4 ml-4 sm:ml-12">
                <button
                  onClick={() => setActiveTab("sales")}
                  className={`pb-2 text-lg sm:text-xl md:text-2xl font-semibold ${
                    activeTab === "sales"
                      ? "border-b-4 border-yellow-400 text-black"
                      : "text-gray-500"
                  }`}
                >
                  Monthly Sales
                </button>
                <button
                  onClick={() => setActiveTab("revenue")}
                  className={`pb-2 text-lg sm:text-xl md:text-2xl font-semibold ${
                    activeTab === "revenue"
                      ? "border-b-4 border-yellow-400 text-black"
                      : "text-gray-500"
                  }`}
                >
                  Monthly Revenue
                </button>
              </div>

              <MonthlySales activeTab={activeTab} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:mt-4">
            {/* Agent Info */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full sm:w-[20rem] sm:mx-auto lg:w-[20rem]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm">Sales</p>
                  <p className="text-xs text-gray-500">Agent Code: 67738</p>
                </div>
              </div>
              <p className="text-sm">Main Balance</p>
              <p className="text-lg font-semibold">₹9,99,99,99,999</p>
              <button className="text-blue-500 text-sm mt-2">Edit profile</button>
            </div>

            {/* Search Itinerary */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full sm:w-[20rem] sm:mx-auto lg:w-[20rem]">
              <h2 className="text-lg font-semibold mb-2">Search Itinerary</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Ref No./PNR/Mobile"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-sm">
                  Search
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full sm:w-[20rem] sm:mx-auto lg:w-[20rem]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="mr-2" size={20} />
                  <span>
                    {calendarDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </h3>
                <div className="flex items-center space-x-2">
                  <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </div>
                ))}

                {Array(firstDayIndex)
                  .fill(null)
                  .map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                {days.map((day) => {
                  const isToday =
                    day === today.getDate() &&
                    displayedMonth === today.getMonth() &&
                    displayedYear === today.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`text-sm p-2 rounded-full cursor-pointer transition-all duration-150 ${
                        isToday
                          ? "bg-yellow-500 text-white font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;