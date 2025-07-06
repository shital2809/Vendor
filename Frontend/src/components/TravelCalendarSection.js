import { useState, useEffect } from "react";

const TravelCalendarSection = () => {
  // State for month, year, and highlighted dates
  const [month, setMonth] = useState(new Date().toLocaleString("default", { month: "long" }));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [highlightedDates, setHighlightedDates] = useState([]);

  // Update highlighted dates when month or year changes
  useEffect(() => {
    const today = new Date();
    if (
      month === today.toLocaleString("default", { month: "long" }) &&
      year === today.getFullYear().toString()
    ) {
      setHighlightedDates([today.getDate()]);
    } else {
      setHighlightedDates([]); // Clear highlights if not the current month/year
    }
  }, [month, year]);

  // Generate calendar days based on selected month and year
  const renderCalendar = () => {
    const selectedDate = new Date(year, getMonthIndex(month), 1);
    const daysInMonth = new Date(year, getMonthIndex(month) + 1, 0).getDate(); // Days in the selected month
    const firstDay = new Date(year, getMonthIndex(month), 1).getDay(); // First day of the month

    const days = [];
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isHighlighted = highlightedDates.includes(day);
      days.push(
        <div
          key={day}
          className={`border p-2 text-center ${isHighlighted ? "bg-yellow-100" : ""}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Helper function to get month index from month name
  const getMonthIndex = (monthName) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months.indexOf(monthName);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Travel Calendar</h2>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
        >
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-md text-sm w-full sm:w-auto">
          Show Details
        </button>
      </div>

      <div className="border rounded-lg p-4">
        <div className="text-center font-semibold mb-2">{month.toUpperCase()} {year}</div>
        <div className="grid grid-cols-7 gap-1">
          <div className="border p-2 text-center font-semibold">SUN</div>
          <div className="border p-2 text-center font-semibold">MON</div>
          <div className="border p-2 text-center font-semibold">TUE</div>
          <div className="border p-2 text-center font-semibold">WED</div>
          <div className="border p-2 text-center font-semibold">THU</div>
          <div className="border p-2 text-center font-semibold">FRI</div>
          <div className="border p-2 text-center font-semibold">SAT</div>
          {renderCalendar()}
        </div>
      </div>

      <div className="text-right mt-4 text-sm text-gray-500">Total Bookings: 0</div>
    </div>
  );
};

export default TravelCalendarSection;