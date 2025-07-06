
import { useState, useEffect } from 'react';
import profileImg from '../assets/images/profile.jpg';
import { Pencil, User, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import Sidebardash from '../components/Sidebardash';
import Button from '../components/Button';
import TravellerProfileSearch from '../components/TravellerProfileSearch';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Profile");
  const [travelerProfiles, setTravelerProfiles] = useState([]);
  const [filteredTravelerProfiles, setFilteredTravelerProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [formData, setFormData] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    travelType: "Domestic",
    passportNumber: "",
  });
  const [companyFormData, setCompanyFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyMobile: "",
  });
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
 

  // Function to decode JWT token and extract user details
  const decodeToken = () => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
    if (!token) {
      console.error("No token found in localStorage");
      setErrors({ submit: "Authentication token is missing. Please log in." });
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error("Invalid token format: No payload section");
        return null;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded payload:", decoded);
      return {
        id: decoded.vendor_id || decoded.user_id || decoded.id || decoded.userId || decoded.vendorId,
        name: decoded.name || '',
        email: decoded.email || '',
        phone: decoded.phone || '',
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch user details on component mount or tab change
  useEffect(() => {
    if (activeTab === "My Profile") {
      const decoded = decodeToken();
      if (decoded) {
        setUserDetails({
          name: decoded.name,
          email: decoded.email,
          phone: decoded.phone,
        });
      }
    }
  }, [activeTab]);

  // Fetch travelers on mount or tab change
  useEffect(() => {
    const fetchTravelers = async () => {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
      if (!token) {
        console.error("No authentication token found");
        setErrors({ submit: "Authentication token is missing. Please log in." });
        return;
      }

      try {
        const url = "https://vendor-f6gw.onrender.com/api/user/travelers";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("GET Response status:", response.status);
        const data = await response.json();
        console.log("GET Response data:", data);

        if (response.ok) {
          console.log("Fetched travelers:", data.travelers);
          setTravelerProfiles(data.travelers);
          setFilteredTravelerProfiles(data.travelers);
        } else {
          console.error("Error fetching travelers:", data.error);
          setErrors({ submit: data.error || "Failed to fetch travelers" });
        }
      } catch (error) {
        console.error("Network error:", error);
        setErrors({ submit: "Server error" });
      }
    };

    if (activeTab === "Traveller Profile") {
      fetchTravelers();
    }
  }, [activeTab]);

  const sidebarItems = ["My Profile", "Traveller Profile", "Company Details"];

  const handleAddNewProfile = () => {
    setShowAddForm(!showAddForm);
    setEditingProfileId(null);
    setFormData({
      prefix: "",
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      travelType: "Domestic",
      passportNumber: "",
    });
  };

  const handleEditProfile = (profile) => {
    setEditingProfileId(profile.id);
    setShowAddForm(true);
    setFormData({
      prefix: profile.prefix || "",
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      mobile: profile.mobile || "",
      email: profile.email || "",
      travelType: "Domestic",
      passportNumber: profile.passport_number || "",
    });
  };

  const handleAddCompanyDetails = () => {
    setShowCompanyForm(!showCompanyForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.firstName || !formData.lastName) {
      tempErrors.firstName = "First name and last name are required";
    }
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!formData.passportNumber) {
      tempErrors.passportNumber = "required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateCompanyForm = () => {
    let tempErrors = {};
    if (!companyFormData.companyName) {
      tempErrors.companyName = "Company name is required";
    }
    if (companyFormData.companyMobile && !/^\d{10}$/.test(companyFormData.companyMobile)) {
      tempErrors.companyMobile = "Mobile number must be exactly 10 digits";
    }
    if (!companyFormData.companyEmail) {
      tempErrors.companyEmail = "Company email is required";
    } else if (!/\S+@\S+\.\S+/.test(companyFormData.companyEmail)) {
      tempErrors.companyEmail = "Invalid email format";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
    if (!token) {
      console.error("No authentication token found");
      setErrors({ submit: "Authentication token is missing. Please log in." });
      return;
    }

    const url = "https://vendor-f6gw.onrender.com/api/user/travelers";

    try {
      console.log("Sending request to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix: formData.prefix || null,
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.mobile || null,
          email: formData.email || null,
          passport_number: formData.passportNumber || null,
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Traveler created:", data.traveler);
        const newTraveler = { id: data.traveler.id || travelerProfiles.length + 1, ...data.traveler };
        setTravelerProfiles(prev => [...prev, newTraveler]);
        setFilteredTravelerProfiles(prev => [...prev, newTraveler]);
        setShowAddForm(false);
        setFormData({
          prefix: "",
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          passportNumber: "",
        });
        setErrors({});
      } else {
        console.error("Error:", data.error);
        setErrors({ submit: data.error });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ submit: "Server error" });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
    if (!token) {
      console.error("No authentication token found");
      setErrors({ submit: "Authentication token is missing. Please log in." });
      return;
    }

    const url = `hhttps://vendor-f6gw.onrender.com/api/user/travelers/${editingProfileId}`;

    try {
      console.log("Sending update request to:", url);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix: formData.prefix || null,
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.mobile || null,
          email: formData.email || null,
          passport_number: formData.passportNumber || null,
        }),
      });

      console.log("Update Response status:", response.status);
      const data = await response.json();
      console.log("Update Response data:", data);

      if (response.ok) {
        console.log("Traveler updated:", data.traveler);
        setTravelerProfiles(prev =>
          prev.map(profile =>
            profile.id === editingProfileId
              ? { ...profile, ...data.traveler }
              : profile
          )
        );
        setFilteredTravelerProfiles(prev =>
          prev.map(profile =>
            profile.id === editingProfileId
              ? { ...profile, ...data.traveler }
              : profile
          )
        );
        setShowAddForm(false);
        setEditingProfileId(null);
        setFormData({
          prefix: "",
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          passportNumber: "",
        });
        setErrors({});
      } else {
        console.error("Error updating traveler:", data.error);
        setErrors({ submit: data.error || "Failed to update traveler" });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ submit: "Server error" });
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    console.log("Company form submitted with data:", companyFormData);
    if (!validateCompanyForm()) {
      console.log("Company form validation failed:", errors);
      return;
    }

    const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
    if (!token) {
      console.error("No authentication token found");
      setErrors({ submit: "Authentication token is missing. Please log in." });
      return;
    }
  };

  const handleDeleteProfile = async (profileId) => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("vendor_token");
    if (!token) {
      console.error("No authentication token found");
      setErrors({ submit: "Authentication token is missing. Please log in." });
      return false;
    }

    try {
      const url = `https://vendor-f6gw.onrender.com/api/user/travelers/${profileId}`;
      console.log(`Attempting to delete profile ID: ${profileId}`);
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`DELETE Response status for profile ID ${profileId}:`, response.status);
      const data = await response.json();
      console.log(`DELETE Response data for profile ID ${profileId}:`, data);

      if (response.ok) {
        console.log(`Traveler deleted successfully: ${profileId}`);
        setTravelerProfiles(prev => prev.filter(profile => profile.id !== profileId));
        setFilteredTravelerProfiles(prev => prev.filter(profile => profile.id !== profileId));
        setSelectedProfiles(prev => prev.filter(id => id !== profileId));
        return true;
      } else {
        console.error(`Error deleting traveler ${profileId}:`, data.error);
        setErrors({ submit: data.error || `Failed to delete traveler ${profileId}` });
        return false;
      }
    } catch (error) {
      console.error(`Network error for profile ID ${profileId}:`, error);
      setErrors({ submit: "Server error" });
      return false;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "My Profile":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold border-b-2 border-yellow-400 pb-1 text-gray-800">
                My Profile
              </h2>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative w-20 h-20">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border"
                />
                <div className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full cursor-pointer">
                  <Pencil size={16} className="text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="font-semibold text-lg">{userDetails.name || 'Vendor'}</div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" /> User Name: <span className="font-medium">{userDetails.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {userDetails.email || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {userDetails.phone || 'N/A'}
                </div>
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <User className="w-4 h-4" />
                EDIT PROFILE
              </button>
            </div>
            {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
          </>
        );
      case "Traveller Profile":
        return (
          <>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold border-b-2 border-yellow-400 pb-1 text-gray-800">
                Traveller Profile
              </h2>
            </div>
            <TravellerProfileSearch
              searchCriteriaOptions={["All", "Name", "Mobile"]}
              defaultSearchCriteria="All"
              onSearch={(searchType, searchValue) => {
                console.log("Search triggered:", { searchType, searchValue });
                if (searchType === "All") {
                  setFilteredTravelerProfiles(travelerProfiles);
                  setSelectedProfiles([]);
                } else if (searchType === "Name" && searchValue) {
                  const filtered = travelerProfiles.filter(profile =>
                    `${profile.prefix || ''} ${profile.first_name} ${profile.last_name}`
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                  setFilteredTravelerProfiles(filtered);
                  setSelectedProfiles([]);
                } else if (searchType === "Mobile" && searchValue) {
                  const filtered = travelerProfiles.filter(profile =>
                    profile.mobile && profile.mobile.includes(searchValue)
                  );
                  setFilteredTravelerProfiles(filtered);
                  setSelectedProfiles([]);
                } else {
                  setFilteredTravelerProfiles(travelerProfiles);
                  setSelectedProfiles([]);
                }
              }}
              onDelete={async (selectAll) => {
                console.log("onDelete called with selectAll:", selectAll);
                console.log("Current selectedProfiles:", selectedProfiles);
                if (selectAll) {
                  const allProfileIds = filteredTravelerProfiles.map((p) => p.id);
                  console.log("Selecting all profiles:", allProfileIds);
                  setSelectedProfiles(allProfileIds);
                } else if (selectedProfiles.length > 0) {
                  console.log("Attempting to delete profiles:", selectedProfiles);
                  const deletionResults = await Promise.all(
                    selectedProfiles.map(async (profileId) => {
                      const success = await handleDeleteProfile(profileId);
                      return { profileId, success };
                    })
                  );

                  console.log("Deletion results:", deletionResults);
                  const successfulDeletions = deletionResults
                    .filter(result => result.success)
                    .map(result => result.profileId);

                  console.log("Successful deletions:", successfulDeletions);

                  if (successfulDeletions.length > 0) {
                    setTravelerProfiles(prevProfiles => prevProfiles.filter(p => !successfulDeletions.includes(p.id)));
                    setFilteredTravelerProfiles(prevFiltered => prevFiltered.filter(p => !successfulDeletions.includes(p.id)));
                    setSelectedProfiles([]);
                  }

                  if (successfulDeletions.length < selectedProfiles.length) {
                    console.log("Some deletions failed");
                    setErrors({ submit: "Some profiles could not be deleted" });
                  } else if (successfulDeletions.length > 0) {
                    console.log("All selected profiles deleted successfully");
                  }
                } else {
                  console.log("No profiles selected for deletion");
                }
              }}
              selectedProfiles={selectedProfiles}
            />

            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <Button
                type="button"
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md text-sm"
                onClick={handleAddNewProfile}
              >
                {showAddForm ? "Cancel" : "Add New Profile"}
              </Button>
            </div>

            {showAddForm && (
              <form onSubmit={editingProfileId ? handleUpdateProfile : handleSubmit} className="mt-4 bg-gray-100 p-4 rounded space-y-4 shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleInputChange}
                    className="border p-2 rounded lg:w-24 md:w-24 w-24 sm:w-1/4"
                    required
                  >
                    <option value="" disabled>Prefix</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full sm:flex-1"
                    required
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full sm:flex-1"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                    pattern="\d{10}"
                    maxLength="10"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    name="passportNumber"
                    placeholder="Passport Number"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm"
                >
                  {editingProfileId ? "Update" : "Submit"}
                </Button>
              </form>
            )}

            <div className="mt-4 space-y-4">
              {filteredTravelerProfiles.map((profile) => (
                <div key={profile.id} className="bg-white p-2 sm:p-4 rounded shadow border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedProfiles.includes(profile.id)}
                        onChange={(e) => {
                          setSelectedProfiles(
                            e.target.checked
                              ? [...selectedProfiles, profile.id]
                              : selectedProfiles.filter((id) => id !== profile.id)
                          );
                        }}
                        className="accent-lime-400 w-4 h-4"
                      />
                      <span className="text-sm sm:text-base">{`${profile.prefix || ''} ${profile.first_name} ${profile.last_name}`.trim()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base">
                      <span>{profile.mobile || 'N/A'}</span>
                      <span>{profile.passport_number || profile.id}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProfile(profile)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case "Company Details":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold border-b-2 border-yellow-400 pb-1 text-gray-800">
                Company Details
              </h2>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <Button
                type="button"
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md text-sm"
                onClick={handleAddCompanyDetails}
              >
                {showCompanyForm ? "Cancel" : "Add Company Details"}
              </Button>
            </div>
            {showCompanyForm && (
              <form onSubmit={handleCompanySubmit} className="mt-4 bg-gray-100 p-4 rounded space-y-4 shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="companyName"
                      placeholder="Company Name"
                      value={companyFormData.companyName}
                      onChange={handleCompanyInputChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                    {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                  </div>
                  <div>
                    <input
                      name="companyEmail"
                      type="email"
                      placeholder="Company Email"
                      value={companyFormData.companyEmail}
                      onChange={handleCompanyInputChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                    {errors.companyEmail && <p className="text-red-500 text-sm">{errors.companyEmail}</p>}
                  </div>
                  <div>
                    <input
                      name="companyMobile"
                      placeholder="Company Mobile"
                      value={companyFormData.companyMobile}
                      onChange={handleCompanyInputChange}
                      className="border p-2 rounded w-full"
                      pattern="\d{10}"
                      maxLength="10"
                    />
                    {errors.companyMobile && <p className="text-red-500 text-sm">{errors.companyMobile}</p>}
                  </div>
                </div>
                {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm"
                >
                  Submit
                </Button>
              </form>
            )}
          </>
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
      <Navbar />
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
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
          <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} className="w-full lg:w-1/5" />
          <div className="flex-1 bg-white rounded-lg shadow p-4">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;