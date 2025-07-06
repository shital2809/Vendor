import ItinerarySearchComponent from "../components/ItinerarySearchComponent";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import Sidebardash from "../components/Sidebardash";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [activeTab, setActiveTab] = useState("Account Status");
  const navigate = useNavigate();
  const sidebarItems = [
    "Account Status",
    "Account Statement",
    "GST Statement",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Account Status":
        return (
          <ItinerarySearchComponent
            title="Account Status"
            searchCriteriaOptions={["2024-25", "2025-26"]}
            defaultSearchCriteria="2025-26"
            mandatoryFields={["Financial Year", "From Date", "To Date"]}
            isAccountPage={true}
            activeTab={activeTab}
          />
        );
      case "Account Statement":
        return (
          <ItinerarySearchComponent
            title="Account Statement"
            searchCriteriaOptions={["2024-25", "2025-26"]}
            defaultSearchCriteria="2025-26"
            mandatoryFields={[ "Service","Summary","Financial Year","From Date", "To Date"]}
            isAccountPage={true}
            activeTab={activeTab}
          />
        );
      case "GST Statement":
        return (
          <ItinerarySearchComponent
            title="GST Statement"
            searchCriteriaOptions={["2024-25", "2025-26"]}
            defaultSearchCriteria="2025-26"
            mandatoryFields={["Financial Year", "From Date", "To Date"]}
            isAccountPage={true}
            activeTab={activeTab}
          />
        );
      default:
        return <div className="text-center text-gray-500">Coming Soon!</div>;
    }
  };
  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <section className="bg-gray-200 min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="p-4">
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
        {/* Show DashboardHeader only on large devices */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        {/* Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
          {/* Sidebar (top on mobile, left on large screens) */}
          <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />

          {/* Main Section */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;