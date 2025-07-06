
// import Navbar from "../components/Navbar";
// import DashboardHeader from "../components/DashboardHeader";
// import Sidebardash from "../components/Sidebardash";
// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("User Management");
//   const navigate = useNavigate();
//   const sidebarItems = [
//     "User Management",
//     "User List",
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       default:
//         return <div className="text-center text-gray-500">Coming Soon!</div>;
//     }
//   };
//   const navigateToHome = () => {
//     navigate('/');
//   };

//   return (
//     <section className="bg-gray-200 min-h-screen">
//       {/* Top Navbar */}
//       <Navbar />

//       {/* Page Content */}
//       <div className="p-4">
//       <div className="block lg:hidden mb-4">
//           <button
//             onClick={navigateToHome}
//             className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
//           >
        
//               <span className="text-black text-sm">
//                 <ArrowLeft />
//               </span>
            
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//         {/* Show DashboardHeader only on large devices */}
//         <div className="hidden lg:block">
//           <DashboardHeader />
//         </div>

//         {/* Layout Wrapper */}
//         <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
//           {/* Sidebar (top on mobile, left on large screens) */}
//           <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />

//           {/* Main Section */}
//           <div className="flex-1 bg-white rounded-lg shadow p-4">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserManagement;


// import Navbar from "../components/Navbar";
// import DashboardHeader from "../components/DashboardHeader";
// import Sidebardash from "../components/Sidebardash";
// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("User Management");
//   const navigate = useNavigate();
//   const sidebarItems = ["User Management", "User List"];

//   // State for form data and feedback
//   const [formData, setFormData] = useState({
//     vendor_id: "", // You might want to set this dynamically based on the logged-in vendor
//     name: "",
//     email: "",
//     password: "",
//     contact_number: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Basic validation
//     if (!formData.vendor_id || !formData.name || !formData.email || !formData.password || !formData.contact_number) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/vendor/subvendors", formData);
//       setSuccess("Subvendor created successfully!");
//       // Reset form
//       setFormData({
//         vendor_id: "",
//         name: "",
//         email: "",
//         password: "",
//         contact_number: "",
//       });
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to create subvendor");
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "User Management":
//         return (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Create Subvendor</h2>
//             {error && <div className="text-red-500 mb-4">{error}</div>}
//             {success && <div className="text-green-500 mb-4">{success}</div>}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
//                 <input
//                   type="number"
//                   name="vendor_id"
//                   value={formData.vendor_id}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Vendor ID"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Email"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Password"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                 <input
//                   type="text"
//                   name="contact_number"
//                   value={formData.contact_number}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Contact Number"
//                   required
//                   maxLength={10}
//                   pattern="\d{10}"
//                   title="Please enter exactly 10 digits"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//               >
//                 Create Subvendor
//               </button>
//             </form>
//           </div>
//         );
//       default:
//         return <div className="text-center text-gray-500">Coming Soon!</div>;
//     }
//   };

//   const navigateToHome = () => {
//     navigate("/");
//   };

//   return (
//     <section className="bg-gray-200 min-h-screen">
//       {/* Top Navbar */}
//       <Navbar />

//       {/* Page Content */}
//       <div className="p-4">
//         <div className="block lg:hidden mb-4">
//           <button
//             onClick={navigateToHome}
//             className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
//           >
//             <span className="text-black text-sm">
//               <ArrowLeft />
//             </span>
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//         {/* Show DashboardHeader only on large devices */}
//         <div className="hidden lg:block">
//           <DashboardHeader />
//         </div>

//         {/* Layout Wrapper */}
//         <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
//           {/* Sidebar (top on mobile, left on large screens) */}
//           <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />

//           {/* Main Section */}
//           <div className="flex-1 bg-white rounded-lg shadow p-4">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserManagement;
//.........................................................................................
// import Navbar from "../components/Navbar";
// import DashboardHeader from "../components/DashboardHeader";
// import Sidebardash from "../components/Sidebardash";
// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("User Management");
//   const navigate = useNavigate();
//   const sidebarItems = ["User Management", "User List"];

//   // State for form data and feedback
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact_number: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Basic validation
//     if (!formData.name || !formData.email || !formData.password || !formData.contact_number) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("vendor_token"); // Retrieve token from local storage
//       if (!token) {
//         setError("You must be logged in to create a subvendor");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/api/vendor/subvendors",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       setSuccess("Subvendor created successfully!");
//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         contact_number: "",
//       });
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to create subvendor");
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "User Management":
//         return (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Create Subvendor</h2>
//             {error && <div className="text-red-500 mb-4">{error}</div>}
//             {success && <div className="text-green-500 mb-4">{success}</div>}
//             <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete="new-email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Email"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   autoComplete="new-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Password"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                 <input
//                   type="text"
//                   name="contact_number"
//                   value={formData.contact_number}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Contact Number"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//               >
//                 Create Subvendor
//               </button>
//             </form>
//           </div>
//         );
//       default:
//         return <div className="text-center text-gray-500">Coming Soon!</div>;
//     }
//   };

//   const navigateToHome = () => {
//     navigate("/");
//   };

//   return (
//     <section className="bg-gray-200 min-h-screen">
//       {/* Top Navbar */}
//       <Navbar />

//       {/* Page Content */}
//       <div className="p-4">
//         <div className="block lg:hidden mb-4">
//           <button
//             onClick={navigateToHome}
//             className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
//           >
//             <span className="text-black text-sm">
//               <ArrowLeft />
//             </span>
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//         {/* Show DashboardHeader only on large devices */}
//         <div className="hidden lg:block">
//           <DashboardHeader />
//         </div>

//         {/* Layout Wrapper */}
//         <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
//           {/* Sidebar (top on mobile, left on large screens) */}
//           <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />

//           {/* Main Section */}
//           <div className="flex-1 bg-white rounded-lg shadow p-4">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserManagement;

//.....................................................................................

// import Navbar from "../components/Navbar";
// import DashboardHeader from "../components/DashboardHeader";
// import Sidebardash from "../components/Sidebardash";
// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("User Management");
//   const navigate = useNavigate();
//   const sidebarItems = ["User Management", "User List"];

//   // State for creating subvendor
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact_number: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // State for assigning permissions
//   const [subvendors, setSubvendors] = useState([]);
//   const [selectedSubvendor, setSelectedSubvendor] = useState("");
//   const [permissions, setPermissions] = useState([
//     { id: 1, name: "Dashboard", can_view: false, can_manage: false },
//     { id: 2, name: "My Bookings", can_view: false, can_manage: false },
//     { id: 3, name: "Accounts", can_view: false, can_manage: false },
//     { id: 4, name: "Sales", can_view: false, can_manage: false },
//     { id: 5, name: "User Management", can_view: false, can_manage: false },
//     { id: 6, name: "My Profile", can_view: false, can_manage: false },
//   ]);
//   const [permissionError, setPermissionError] = useState("");
//   const [permissionSuccess, setPermissionSuccess] = useState("");

//   // Fetch subvendors on component mount
//   useEffect(() => {
//     const fetchSubvendors = async () => {
//       try {
//         const token = localStorage.getItem("vendor_token");
//         if (!token) {
//           setError("You must be logged in to view subvendors");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/vendor/subvendors", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSubvendors(response.data);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch subvendors");
//       }
//     };

//     fetchSubvendors();
//   }, []);

//   // Handle form input changes for creating subvendor
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission for creating subvendor
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.email || !formData.password || !formData.contact_number) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("vendor_token");
//       if (!token) {
//         setError("You must be logged in to create a subvendor");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/api/vendor/subvendors",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       setSuccess("Subvendor created successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         contact_number: "",
//       });

//       // Refresh subvendors list
//       const subvendorResponse = await axios.get("http://localhost:5000/api/vendor/subvendors", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubvendors(subvendorResponse.data);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to create subvendor");
//     }
//   };

//   // Handle permission checkbox changes
//   const handlePermissionChange = (permissionId, field) => {
//     setPermissions(
//       permissions.map((perm) =>
//         perm.id === permissionId ? { ...perm, [field]: !perm[field] } : perm
//       )
//     );
//   };

//   // Handle permission assignment submission
//   const handlePermissionSubmit = async (e) => {
//     e.preventDefault();
//     setPermissionError("");
//     setPermissionSuccess("");

//     if (!selectedSubvendor) {
//       setPermissionError("Please select a subvendor");
//       return;
//     }

//     const permissionsToAssign = permissions
//       .filter((perm) => perm.can_view || perm.can_manage)
//       .map((perm) => ({
//         permission_id: perm.id,
//         can_view: perm.can_view,
//         can_manage: perm.can_manage,
//       }));

//     if (permissionsToAssign.length === 0) {
//       setPermissionError("Please select at least one permission to assign");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("vendor_token");
//       if (!token) {
//         setPermissionError("You must be logged in to assign permissions");
//         return;
//       }

//       await axios.post(
//         "http://localhost:5000/api/vendor/permissions/assign",
//         {
//           subvendor_id: parseInt(selectedSubvendor),
//           permissions: permissionsToAssign,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       setPermissionSuccess("Permissions assigned successfully!");
//       // Reset permissions form
//       setPermissions(
//         permissions.map((perm) => ({ ...perm, can_view: false, can_manage: false }))
//       );
//     } catch (err) {
//       setPermissionError(err.response?.data?.error || "Failed to assign permissions");
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "User Management":
//         return (
//           <div>
//             {/* Create Subvendor Section */}
//             <h2 className="text-xl font-semibold mb-4">Create Subvendor</h2>
//             {error && <div className="text-red-500 mb-4">{error}</div>}
//             {success && <div className="text-green-500 mb-4">{success}</div>}
//             <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete="new-email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Email"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   autoComplete="new-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Password"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                 <input
//                   type="text"
//                   name="contact_number"
//                   value={formData.contact_number}
//                   onChange={handleChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter Contact Number"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//               >
//                 Create Subvendor
//               </button>
//             </form>

//             {/* Assign Permissions Section */}
//             <div className="mt-8">
//               <h2 className="text-xl font-semibold mb-4">Assign Permissions</h2>
//               {permissionError && <div className="text-red-500 mb-4">{permissionError}</div>}
//               {permissionSuccess && <div className="text-green-500 mb-4">{permissionSuccess}</div>}
//               <form onSubmit={handlePermissionSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Select Subvendor</label>
//                   <select
//                     value={selectedSubvendor}
//                     onChange={(e) => setSelectedSubvendor(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">Select a subvendor</option>
//                     {subvendors.map((subvendor) => (
//                       <option key={subvendor.id} value={subvendor.id}>
//                         {subvendor.name} ({subvendor.email})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
//                   <div className="grid grid-cols-3 gap-4 font-medium text-gray-700">
//                     <div>Feature</div>
//                     <div>Can View</div>
//                     <div>Can Manage</div>
//                   </div>
//                   {permissions.map((permission) => (
//                     <div key={permission.id} className="grid grid-cols-3 gap-4 items-center">
//                       <div>{permission.name}</div>
//                       <div>
//                         <input
//                           type="checkbox"
//                           checked={permission.can_view}
//                           onChange={() => handlePermissionChange(permission.id, "can_view")}
//                         />
//                       </div>
//                       <div>
//                         <input
//                           type="checkbox"
//                           checked={permission.can_manage}
//                           onChange={() => handlePermissionChange(permission.id, "can_manage")}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//                 >
//                   Assign Permissions
//                 </button>
//               </form>
//             </div>
//           </div>
//         );
//       default:
//         return <div className="text-center text-gray-500">Coming Soon!</div>;
//     }
//   };

//   const navigateToHome = () => {
//     navigate("/");
//   };

//   return (
//     <section className="bg-gray-200 min-h-screen">
//       {/* Top Navbar */}
//       <Navbar />

//       {/* Page Content */}
//       <div className="p-4">
//         <div className="block lg:hidden mb-4">
//           <button
//             onClick={navigateToHome}
//             className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
//           >
//             <span className="text-black text-sm">
//               <ArrowLeft />
//             </span>
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//         {/* Show DashboardHeader only on large devices */}
//         <div className="hidden lg:block">
//           <DashboardHeader />
//         </div>

//         {/* Layout Wrapper */}
//         <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
//           {/* Sidebar (top on mobile, left on large screens) */}
//           <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />

//           {/* Main Section */}
//           <div className="flex-1 bg-white rounded-lg shadow p-4">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserManagement;


//........................................................................................................................................

// import Navbar from "../components/Navbar";
// import DashboardHeader from "../components/DashboardHeader";
// import Sidebardash from "../components/Sidebardash";
// import { useState, useEffect } from "react";
// import { ArrowLeft, Edit, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("User Management");
//   const [subTab, setSubTab] = useState("Subvendor");
//   const navigate = useNavigate();
//   const sidebarItems = ["User Management", "User List"];

//   // State for creating/editing subvendor
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact_number: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [subvendors, setSubvendors] = useState([]);
//   const [editingSubvendor, setEditingSubvendor] = useState(null);

//   // State for assigning/editing permissions
//   const [selectedSubvendor, setSelectedSubvendor] = useState("");
//   const [permissions, setPermissions] = useState([]);
//   const [permissionError, setPermissionError] = useState("");
//   const [permissionSuccess, setPermissionSuccess] = useState("");

//   // Fetch subvendors and permissions on component mount
//   useEffect(() => {
//     const fetchSubvendors = async () => {
//       try {
//         const token = localStorage.getItem("vendor_token");
//         if (!token) {
//           setError("You must be logged in to view subvendors");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/vendor/subvendors", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSubvendors(response.data);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch subvendors");
//       }
//     };

//     const fetchPermissions = async () => {
//       try {
//         const token = localStorage.getItem("vendor_token");
//         if (!token) {
//           setError("You must be logged in to view permissions");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/vendor/permissions", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const permissionsWithFlags = response.data.map((perm) => ({
//           ...perm,
//           can_view: false,
//           can_manage: false,
//         }));
//         setPermissions(permissionsWithFlags);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch permissions");
//       }
//     };

//     fetchSubvendors();
//     fetchPermissions();
//   }, []);

//   // Fetch permissions for a selected subvendor
//   const fetchSubvendorPermissions = async (subvendorId) => {
//     try {
//       const token = localStorage.getItem("vendor_token");
//       const response = await axios.get(`http://localhost:5000/api/vendor/subvendors/${subvendorId}/permissions`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const subvendorPermissions = response.data;
//       setPermissions((prevPermissions) =>
//         prevPermissions.map((perm) => {
//           const subvendorPerm = subvendorPermissions.find((sp) => sp.id === perm.id);
//           return subvendorPerm
//             ? { ...perm, can_view: subvendorPerm.can_view, can_manage: subvendorPerm.can_manage }
//             : { ...perm, can_view: false, can_manage: false };
//         })
//       );
//     } catch (err) {
//       setPermissionError(err.response?.data?.error || "Failed to fetch subvendor permissions");
//     }
//   };

//   // Handle form input changes for creating/editing subvendor
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission for creating/updating subvendor
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.email || (editingSubvendor ? false : !formData.password) || !formData.contact_number) {
//       setError("All fields are required" + (editingSubvendor ? "" : ", including password for new subvendor"));
//       return;
//     }

//     try {
//       const token = localStorage.getItem("vendor_token");
//       if (!token) {
//         setError("You must be logged in to perform this action");
//         return;
//       }

//       if (editingSubvendor) {
//         // Update subvendor
//         const response = await axios.put(
//           `http://localhost:5000/api/vendor/subvendors/${editingSubvendor.id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//           }
//         );
//         setSuccess("Subvendor updated successfully!");
//         setSubvendors(subvendors.map((sv) => (sv.id === editingSubvendor.id ? response.data : sv)));
//         setEditingSubvendor(null);
//       } else {
//         // Create subvendor
//         const response = await axios.post(
//           "http://localhost:5000/api/vendor/subvendors",
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//           }
//         );
//         setSuccess("Subvendor created successfully!");
//         setSubvendors([...subvendors, response.data]);
//       }

//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         contact_number: "",
//       });
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to save subvendor");
//     }
//   };

//   // Handle edit subvendor
//   const handleEdit = (subvendor) => {
//     setEditingSubvendor(subvendor);
//     setFormData({
//       name: subvendor.name,
//       email: subvendor.email,
//       password: "",
//       contact_number: subvendor.contact_number,
//     });
//   };

//   // Handle delete subvendor
//   const handleDelete = async (subvendorId) => {
//     if (!window.confirm("Are you sure you want to delete this subvendor?")) return;

//     try {
//       const token = localStorage.getItem("vendor_token");
//       await axios.delete(`http://localhost:5000/api/vendor/subvendors/${subvendorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubvendors(subvendors.filter((sv) => sv.id !== subvendorId));
//       setSuccess("Subvendor deleted successfully!");
//       setSelectedSubvendor("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to delete subvendor");
//     }
//   };

//   // Handle subvendor selection for permission assignment
//   const handleSubvendorSelect = (e) => {
//     const subvendorId = e.target.value;
//     setSelectedSubvendor(subvendorId);
//     if (subvendorId) {
//       fetchSubvendorPermissions(subvendorId);
//     } else {
//       setPermissions(permissions.map((perm) => ({ ...perm, can_view: false, can_manage: false })));
//     }
//   };

//   // Handle permission checkbox changes
//   const handlePermissionChange = (permissionId, field) => {
//     setPermissions(
//       permissions.map((perm) =>
//         perm.id === permissionId ? { ...perm, [field]: !perm[field] } : perm
//       )
//     );
//   };

//   // Handle permission assignment submission
//   const handlePermissionSubmit = async (e) => {
//     e.preventDefault();
//     setPermissionError("");
//     setPermissionSuccess("");

//     if (!selectedSubvendor) {
//       setPermissionError("Please select a subvendor");
//       return;
//     }

//     const permissionsToAssign = permissions
//       .filter((perm) => perm.can_view || perm.can_manage)
//       .map((perm) => ({
//         permission_id: perm.id,
//         can_view: perm.can_view,
//         can_manage: perm.can_manage,
//       }));

//     if (permissionsToAssign.length === 0) {
//       setPermissionError("Please select at least one permission to assign");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("vendor_token");
//       if (!token) {
//         setPermissionError("You must be logged in to assign permissions");
//         return;
//       }

//       await axios.post(
//         "http://localhost:5000/api/vendor/permissions/assign",
//         {
//           subvendor_id: parseInt(selectedSubvendor),
//           permissions: permissionsToAssign,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       setPermissionSuccess("Permissions updated successfully!");
//     } catch (err) {
//       setPermissionError(err.response?.data?.error || "Failed to update permissions");
//     }
//   };

//   const renderSubvendorTab = () => (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">{editingSubvendor ? "Edit Subvendor" : "Create Subvendor"}</h2>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter Name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             name="email"
//             autoComplete="new-email"
//             value={formData.email}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter Email"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             name="password"
//             autoComplete="new-password"
//             value={formData.password}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter Password"
//             required={!editingSubvendor}
//             disabled={editingSubvendor}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//           <input
//             type="text"
//             name="contact_number"
//             value={formData.contact_number}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter Contact Number"
//             required
//           />
//         </div>
//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//           >
//             {editingSubvendor ? "Update Subvendor" : "Create Subvendor"}
//           </button>
//           {editingSubvendor && (
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingSubvendor(null);
//                 setFormData({ name: "", email: "", password: "", contact_number: "" });
//               }}
//               className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Subvendor List */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Subvendor List</h2>
//         {subvendors.length === 0 ? (
//           <p className="text-gray-500">No subvendors found.</p>
//         ) : (
//           <div className="space-y-2">
//             {subvendors.map((subvendor) => (
//               <div
//                 key={subvendor.id}
//                 className="flex justify-between items-center p-2 border border-gray-200 rounded-md"
//               >
//                 <div>
//                   <p className="font-medium">{subvendor.name}</p>
//                   <p className="text-sm text-gray-600">{subvendor.email}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleEdit(subvendor)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <Edit size={20} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(subvendor.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderAssignTab = () => (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Assign Permissions</h2>
//       {permissionError && <div className="text-red-500 mb-4">{permissionError}</div>}
//       {permissionSuccess && <div className="text-green-500 mb-4">{permissionSuccess}</div>}
//       <form onSubmit={handlePermissionSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Select Subvendor</label>
//           <select
//             value={selectedSubvendor}
//             onChange={handleSubvendorSelect}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//           >
//             <option value="">Select a subvendor</option>
//             {subvendors.map((subvendor) => (
//               <option key={subvendor.id} value={subvendor.id}>
//                 {subvendor.name} ({subvendor.email})
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedSubvendor && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
//             <div className="grid grid-cols-3 gap-4 font-medium text-gray-700">
//               <div>Feature</div>
//               <div>Can View</div>
//               <div>Can Manage</div>
//             </div>
//             {permissions.map((permission) => (
//               <div key={permission.id} className="grid grid-cols-3 gap-4 items-center">
//                 <div>{permission.name}</div>
//                 <div>
//                   <input
//                     type="checkbox"
//                     checked={permission.can_view}
//                     onChange={() => handlePermissionChange(permission.id, "can_view")}
//                   />
//                 </div>
//                 <div>
//                   <input
//                     type="checkbox"
//                     checked={permission.can_manage}
//                     onChange={() => handlePermissionChange(permission.id, "can_manage")}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//           disabled={!selectedSubvendor}
//         >
//           Update Permissions
//         </button>
//       </form>
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case "User Management":
//         return (
//           <div>
//             {/* Subtabs */}
//             <div className="flex border-b mb-4">
//               <button
//                 onClick={() => setSubTab("Subvendor")}
//                 className={`px-4 py-2 font-medium ${
//                   subTab === "Subvendor"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Subvendor
//               </button>
//               <button
//                 onClick={() => setSubTab("Assign")}
//                 className={`px-4 py-2 font-medium ${
//                   subTab === "Assign"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Assign
//               </button>
//             </div>

//             {/* Subtab Content */}
//             {subTab === "Subvendor" && renderSubvendorTab()}
//             {subTab === "Assign" && renderAssignTab()}
//           </div>
//         );
//       default:
//         return <div className="text-center text-gray-500">Coming Soon!</div>;
//     }
//   };

//   const navigateToHome = () => {
//     navigate("/");
//   };

//   return (
//     <section className="bg-gray-200 min-h-screen">
//       <Navbar />
//       <div className="p-4">
//         <div className="block lg:hidden mb-4">
//           <button
//             onClick={navigateToHome}
//             className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors"
//           >
//             <span className="text-black text-sm">
//               <ArrowLeft />
//             </span>
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//         <div className="hidden lg:block">
//           <DashboardHeader />
//         </div>
//         <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
//           <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />
//           <div className="flex-1 bg-white rounded-lg shadow p-4">{renderContent()}</div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserManagement;


import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import Sidebardash from "../components/Sidebardash";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("User Management");
  const [subTab, setSubTab] = useState("Subvendor");
  const navigate = useNavigate();
  const sidebarItems = ["User Management", "User List"];

  // State for creating/editing subvendor
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subvendors, setSubvendors] = useState([]);
  const [editingSubvendor, setEditingSubvendor] = useState(null);

  // State for assigning/editing permissions
  const [selectedSubvendor, setSelectedSubvendor] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [permissionError, setPermissionError] = useState("");
  const [permissionSuccess, setPermissionSuccess] = useState("");

  // Fetch subvendors and permissions on component mount
  useEffect(() => {
    const fetchSubvendors = async () => {
      try {
        const token = localStorage.getItem("vendor_token");
        if (!token) {
          setError("You must be logged in to view subvendors");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/vendor/subvendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubvendors(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch subvendors");
      }
    };

    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("vendor_token");
        if (!token) {
          setError("You must be logged in to view permissions");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/vendor/permissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const permissionsWithFlags = response.data.map((perm) => ({
          ...perm,
          can_view: false,
          can_manage: false,
        }));
        setPermissions(permissionsWithFlags);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch permissions");
      }
    };

    fetchSubvendors();
    fetchPermissions();
  }, []);

  // Fetch permissions for a selected subvendor
  const fetchSubvendorPermissions = async (subvendorId) => {
    try {
      const token = localStorage.getItem("vendor_token");
      const response = await axios.get(`http://localhost:5000/api/vendor/subvendors/${subvendorId}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const subvendorPermissions = response.data;
      setPermissions((prevPermissions) =>
        prevPermissions.map((perm) => {
          const subvendorPerm = subvendorPermissions.find((sp) => sp.id === perm.id);
          return subvendorPerm
            ? { ...perm, can_view: subvendorPerm.can_view, can_manage: subvendorPerm.can_manage }
            : { ...perm, can_view: false, can_manage: false };
        })
      );
    } catch (err) {
      setPermissionError(err.response?.data?.error || "Failed to fetch subvendor permissions");
    }
  };

  // Handle form input changes for creating/editing subvendor
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId, field) => {
    setPermissions(
      permissions.map((perm) =>
        perm.id === permissionId ? { ...perm, [field]: !perm[field] } : perm
      )
    );
  };

  // Handle form submission for creating/updating subvendor and assigning permissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || (editingSubvendor ? false : !formData.password) || !formData.contact_number) {
      setError("All fields are required" + (editingSubvendor ? "" : ", including password for new subvendor"));
      return;
    }

    try {
      const token = localStorage.getItem("vendor_token");
      if (!token) {
        setError("You must be logged in to perform this action");
        return;
      }

      let subvendorId;
      if (editingSubvendor) {
        // Update subvendor
        const response = await axios.put(
          `http://localhost:5000/api/vendor/subvendors/${editingSubvendor.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setSuccess("Subvendor updated successfully!");
        setSubvendors(subvendors.map((sv) => (sv.id === editingSubvendor.id ? response.data : sv)));
        setEditingSubvendor(null);
      } else {
        // Create subvendor
        const response = await axios.post(
          "http://localhost:5000/api/vendor/subvendors",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        subvendorId = response.data.id;
        setSuccess("Subvendor created successfully!");
        setSubvendors([...subvendors, response.data]);

        // Assign permissions if any are selected
        const permissionsToAssign = permissions
          .filter((perm) => perm.can_view || perm.can_manage)
          .map((perm) => ({
            permission_id: perm.id,
            can_view: perm.can_view,
            can_manage: perm.can_manage,
          }));

        if (permissionsToAssign.length > 0) {
          await axios.post(
            "http://localhost:5000/api/vendor/permissions/assign",
            {
              subvendor_id: subvendorId,
              permissions: permissionsToAssign,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          setSuccess("Subvendor created and permissions assigned successfully!");
        }
      }

      // Reset form and permissions
      setFormData({
        name: "",
        email: "",
        password: "",
        contact_number: "",
      });
      setPermissions(permissions.map((perm) => ({ ...perm, can_view: false, can_manage: false })));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save subvendor or assign permissions");
    }
  };

  // Handle edit subvendor
  const handleEdit = (subvendor) => {
    setEditingSubvendor(subvendor);
    setFormData({
      name: subvendor.name,
      email: subvendor.email,
      password: "",
      contact_number: subvendor.contact_number,
    });
  };

  // Handle delete subvendor
  const handleDelete = async (subvendorId) => {
    if (!window.confirm("Are you sure you want to delete this subvendor?")) return;

    try {
      const token = localStorage.getItem("vendor_token");
      await axios.delete(`http://localhost:5000/api/vendor/subvendors/${subvendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubvendors(subvendors.filter((sv) => sv.id !== subvendorId));
      setSuccess("Subvendor deleted successfully!");
      setSelectedSubvendor("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete subvendor");
    }
  };

  // Handle subvendor selection for permission assignment in Assign tab
  const handleSubvendorSelect = (e) => {
    const subvendorId = e.target.value;
    setSelectedSubvendor(subvendorId);
    if (subvendorId) {
      fetchSubvendorPermissions(subvendorId);
    } else {
      setPermissions(permissions.map((perm) => ({ ...perm, can_view: false, can_manage: false })));
    }
  };

  // Handle permission assignment submission in Assign tab
  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    setPermissionError("");
    setPermissionSuccess("");

    if (!selectedSubvendor) {
      setPermissionError("Please select a subvendor");
      return;
    }

    const permissionsToAssign = permissions
      .filter((perm) => perm.can_view || perm.can_manage)
      .map((perm) => ({
        permission_id: perm.id,
        can_view: perm.can_view,
        can_manage: perm.can_manage,
      }));

    if (permissionsToAssign.length === 0) {
      setPermissionError("Please select at least one permission to assign");
      return;
    }

    try {
      const token = localStorage.getItem("vendor_token");
      if (!token) {
        setPermissionError("You must be logged in to assign permissions");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/vendor/permissions/assign",
        {
          subvendor_id: parseInt(selectedSubvendor),
          permissions: permissionsToAssign,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setPermissionSuccess("Permissions updated successfully!");
    } catch (err) {
      setPermissionError(err.response?.data?.error || "Failed to update permissions");
    }
  };

  const renderSubvendorTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">{editingSubvendor ? "Edit Subvendor" : "Create Subvendor"}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Password"
            required={!editingSubvendor}
            disabled={editingSubvendor}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Contact Number"
            required
          />
        </div>

        {/* Permissions Section (only for creating, not editing) */}
        {!editingSubvendor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Permissions</label>
            <div className="grid grid-cols-3 gap-4 font-medium text-gray-700">
              <div>Feature</div>
              <div>Can View</div>
              <div>Can Manage</div>
            </div>
            {permissions.map((permission) => (
              <div key={permission.id} className="grid grid-cols-3 gap-4 items-center">
                <div>{permission.name}</div>
                <div>
                  <input
                    type="checkbox"
                    checked={permission.can_view}
                    onChange={() => handlePermissionChange(permission.id, "can_view")}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={permission.can_manage}
                    onChange={() => handlePermissionChange(permission.id, "can_manage")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {editingSubvendor ? "Update Subvendor" : "Create Subvendor"}
          </button>
          {editingSubvendor && (
            <button
              type="button"
              onClick={() => {
                setEditingSubvendor(null);
                setFormData({ name: "", email: "", password: "", contact_number: "" });
              }}
              className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Subvendor List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Subvendor List</h2>
        {subvendors.length === 0 ? (
          <p className="text-gray-500">No subvendors found.</p>
        ) : (
          <div className="space-y-2">
            {subvendors.map((subvendor) => (
              <div
                key={subvendor.id}
                className="flex justify-between items-center p-2 border border-gray-200 rounded-md"
              >
                <div>
                  <p className="font-medium">{subvendor.name}</p>
                  <p className="text-sm text-gray-600">{subvendor.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(subvendor)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(subvendor.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Assign Permissions</h2>
      {permissionError && <div className="text-red-500 mb-4">{permissionError}</div>}
      {permissionSuccess && <div className="text-green-500 mb-4">{permissionSuccess}</div>}
      <form onSubmit={handlePermissionSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Subvendor</label>
          <select
            value={selectedSubvendor}
            onChange={handleSubvendorSelect}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a subvendor</option>
            {subvendors.map((subvendor) => (
              <option key={subvendor.id} value={subvendor.id}>
                {subvendor.name} ({subvendor.email})
              </option>
            ))}
          </select>
        </div>

        {selectedSubvendor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-3 gap-4 font-medium text-gray-700">
              <div>Feature</div>
              <div>Can View</div>
              <div>Can Manage</div>
            </div>
            {permissions.map((permission) => (
              <div key={permission.id} className="grid grid-cols-3 gap-4 items-center">
                <div>{permission.name}</div>
                <div>
                  <input
                    type="checkbox"
                    checked={permission.can_view}
                    onChange={() => handlePermissionChange(permission.id, "can_view")}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={permission.can_manage}
                    onChange={() => handlePermissionChange(permission.id, "can_manage")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          disabled={!selectedSubvendor}
        >
          Update Permissions
        </button>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "User Management":
        return (
          <div>
            {/* Subtabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setSubTab("Subvendor")}
                className={`px-4 py-2 font-medium ${
                  subTab === "Subvendor"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                Subvendor
              </button>
              <button
                onClick={() => setSubTab("Assign")}
                className={`px-4 py-2 font-medium ${
                  subTab === "Assign"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                Assign
              </button>
            </div>

            {/* Subtab Content */}
            {subTab === "Subvendor" && renderSubvendorTab()}
            {subTab === "Assign" && renderAssignTab()}
          </div>
        );
      default:
        return <div className="text-center text-gray-500">Coming Soon!</div>;
    }
  };

  const navigateToHome = () => {
    navigate("/");
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
            <span className="text-black text-sm">
              <ArrowLeft />
            </span>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:ml-[100px] lg:mr-[100px] lg:gap-6">
          <Sidebardash activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />
          <div className="flex-1 bg-white rounded-lg shadow p-4">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
};

export default UserManagement;