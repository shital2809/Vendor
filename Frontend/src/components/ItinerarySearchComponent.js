import { useState, useEffect } from "react";
import Button from "./Button"; // Assuming you have a Button component

const ItinerarySearchComponent = ({ 
  title, 
  searchCriteriaOptions, 
  defaultSearchCriteria, 
  additionalFields = [], 
  mandatoryFields = ["Search Criteria", "Service", "Status", "From Date", "To Date"], 
  isAccountPage = false, // Flag to determine if it's the Account page
  activeTab, // Added to determine specific tab behavior
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchCriteria, setSearchCriteria] = useState(defaultSearchCriteria);
  const [service, setService] = useState("All Service");
  const [status, setStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [airline, setAirline] = useState("");
  const [summary, setSummary] = useState("Summary");
  const [report, setReport] = useState("Agent Wise");
  const [financialYear, setFinancialYear] = useState(defaultSearchCriteria || "2025-26");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Set default date to current date on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  }, []);

  // Handle form submission (basic validation for mandatory fields)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert("Please fill in both From Date and To Date fields.");
      return;
    }
    // Add your search logic here
    console.log({
      searchCriteria,
      searchText,
      service,
      status,
      paymentStatus,
      financialYear,
      fromDate,
      toDate,
    });
  };

  // Determine which fields to render based on mandatoryFields
  const renderFields = () => {
    const isAccountStatement = isAccountPage && activeTab === "Account Statement";
    return (
      <div className={`grid ${isAccountStatement ? "md:grid-cols-5" : "md:grid-cols-4"} gap-4 mb-4`}>
        {/* Financial Year */}
        {mandatoryFields.includes("Financial Year") && (
          <div>
            <label className="block text-sm font-medium mb-1">Financial Year *</label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {searchCriteriaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Summary (for Account Statement) */}
        {mandatoryFields.includes("Summary") && isAccountStatement && (
          <div>
            <label className="block text-sm font-medium mb-1">Summary Type *</label>
            <select
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>Summary</option>
              <option>Detailed</option>
            </select>
          </div>
        )}

        {mandatoryFields.includes("Report") && (
          <div>
            <label className="block text-sm font-medium mb-1">Report Type *</label>
            <select
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>SubUser Wise</option>
              <option>Agent Wise</option>
            </select>
          </div>
        )}

        {/* Search Criteria */}
        {mandatoryFields.includes("Search Criteria") && (
          <div>
            <label className="block text-sm font-medium mb-1">Search Criteria *</label>
            <select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {searchCriteriaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Text */}
        {additionalFields.includes("Search Text") && (
          <div>
            <label className="block text-sm font-medium mb-1">Search Text</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Airline */}
        {additionalFields.includes("Airline") && (
          <div>
            <label className="block text-sm font-medium mb-1">Airline</label>
            <input
              type="text"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              placeholder="Enter Airline..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Service */}
        {mandatoryFields.includes("Service") && (
          <div>
            <label className="block text-sm font-medium mb-1">Service *</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>All Service</option>
              <option>Flight</option>
              <option>Hotel</option>
              <option>Bus</option>
              <option>Travel Insurance</option>
            </select>
          </div>
        )}

        {/* Payment Status */}
        {mandatoryFields.includes("Payment Status") && (
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status *</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Payment Pending</option>
              <option>Payment Done</option>
            </select>
          </div>
        )}

        {/* Status */}
        {mandatoryFields.includes("Status") && (
          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
              <option>Failed</option>
              <option>Part Cancelled</option>
              <option>In Progress</option>
              <option>On Hold</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSearch} className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {renderFields()}

      {/* Booking Date / Travel Date or Date Range */}
      <div className="grid md:grid-cols-3 items-end gap-4 mb-4">
        {!isAccountPage && (
          <div className="col-span-2 flex items-center gap-4">
            <label className="flex items-center text-sm gap-2">
              <input type="radio" name="dateType" defaultChecked className="accent-lime-400" />
              <span className="text-black">Booking Date</span>
            </label>
            <label className="flex items-center text-sm gap-2">
              <input type="radio" name="dateType" className="accent-lime-400" />
              <span className="text-black">Travel Date</span>
            </label>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">From Date <span className="text-black">*</span></label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date <span className="text-black">*</span></label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-right space-x-2">
        {!isAccountPage ? (
          <Button
            type="submit"
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-md text-sm"
          >
            Search
          </Button>
        ) : activeTab === "Account Statement" || activeTab === "GST Statement" || activeTab === "Invoice Download" ? (
          <Button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md text-sm"
            onClick={() => console.log("Download clicked")}
          >
            Download
          </Button>
        ) : activeTab === "Sales Statement" ? (
          <>
            <Button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-md text-sm"
            >
              Search
            </Button>
            <Button
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md text-sm"
              onClick={() => console.log("Download clicked")}
            >
              Download
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-md text-sm"
            >
              List
            </Button>
            <Button
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md text-sm"
              onClick={() => console.log("Download clicked")}
            >
              Download
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ItinerarySearchComponent;