


// //......................................................................................................................................
// import React, { useState, useEffect } from "react";
// import { Menu, X, LayoutDashboard, Book, User, DollarSign, Settings, LogOut } from "lucide-react";
// import logo from "../assets/images/logo.png";
// import Button from "./Button";
// import { Link, useNavigate } from "react-router-dom";
// import Input from "./Input";
// import { vendorLogin, verifyOtp, logoutVendor } from "../services/apiService";
// import { useAuth } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";

// export default function Navbar({ onLoginSuccess }) {
//   const { authData, login, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Check token expiration
//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem("vendor_token");
//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//           if (decoded.exp < currentTime) {
//             // Token is expired
//             logout();
//             localStorage.removeItem("vendor_token");
//             setIsDropdownOpen(false);
//             setIsOpen(false);
//             navigate("/");
//             setSuccessMessage("Session expired. Please log in again.");
//             setTimeout(() => setSuccessMessage(""), 3000);
//           }
//         } catch (e) {
//           console.error("Failed to decode token:", e);
//           localStorage.removeItem("vendor_token");
//           logout();
//           navigate("/");
//         }
//       }
//     };

//     // Initial check
//     checkTokenExpiration();

//     // Periodic check every 60 seconds
//     const interval = setInterval(checkTokenExpiration, 60000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, [logout, navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem("vendor_token");
//     if (token && !authData) {
//       try {
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || decoded.email.split("@")[0];
//         login({ token, name: userName, email: decoded.email });
//       } catch (e) {
//         console.error("Failed to decode token:", e);
//         localStorage.removeItem("vendor_token");
//       }
//     }
//   }, [authData, login]);

//   const handleSignIn = async () => {
//     try {
//       setError("");
//       setIsLoading(true);

//       // Check if fields are empty
//       if (!email.trim()) {
//         setError("Please enter email ");
//         setIsLoading(false);
//         return;
//       }
      
//       if (!email.includes("@")) {
//         setError("Please enter a valid email address.");
//         setIsLoading(false);
//         return;
//       }

//       if (!password.trim()) {
//         setError("Please enter password.");
//         setIsLoading(false);
//         return;
//       }

//       const response = await vendorLogin(email, password);
//       if (response.status === "otp_sent") {
//         setShowOtpModal(true);
//         setIsFirstTimeLogin(response.message.includes("set your password"));
//       } else {
//         throw new Error("Unexpected response from login");
//       }
//     } catch (err) {
//       console.error("Login failed:", err.message, err.stack);

//       // Only set the user-friendly error message
//       if (err.response && err.response.status === 401) {
//         setError("Invalid email or password.");
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setOtpError("");

//       if (!otp || otp.length !== 6) {
//         setOtpError("Please enter a valid 6-digit OTP.");
//         return;
//       }
//       if (isFirstTimeLogin && !newPassword) {
//         setOtpError("Please provide a new password.");
//         return;
//       }

//       const data = await verifyOtp(email, otp, isFirstTimeLogin ? newPassword : null);
//       console.log("OTP Verification Response:", data);

//       if (data.status === "password_changed" || data.status === "logged_in") {
//         const token = data.session_id;
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || email.split("@")[0];
//         login({ token, name: userName, email: decoded.email });

//         setShowOtpModal(false);
//         setOtp("");
//         setNewPassword("");
//         if (onLoginSuccess) onLoginSuccess();
//         navigate("/");

//         // Show success popup
//         setSuccessMessage("OTP Verified Successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 seconds
//       } else {
//         throw new Error(data.error || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error("OTP verification failed:", err.message, err.stack);
//       setOtpError(err.message || "Failed to verify OTP. Please try again.");
//     }
//   };

//   const closeOtpModal = () => {
//     setShowOtpModal(false);
//     setOtp("");
//     setNewPassword("");
//     setOtpError("");
//     setIsFirstTimeLogin(false);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await logoutVendor();
//       if (response.status === "success") {
//         logout();
//         setIsDropdownOpen(false);
//         setIsOpen(false);
//         navigate("/");
//       } else {
//         throw new Error("Logout failed");
//       }
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//     }
//   };

//   return (
//     <header className="w-full flex flex-col md:flex-row justify-between items-center py-3 px-4 sm:px-6 bg-white shadow-md relative">
//       {/* Logo and Mobile Menu Button */}
//       <div className="flex justify-between items-center w-full md:w-auto">
//         <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
//         <button className="md:hidden text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Desktop Navigation and Auth */}
//       <div className="hidden md:flex items-center space-x-4">
//         {authData ? (
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <LayoutDashboard size={18} className="mr-2" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/my-bookings"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Book size={18} className="mr-2" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   to="/accounts"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <User size={18} className="mr-2" />
//                   Accounts
//                 </Link>
//                 <Link
//                   to="/sales"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <DollarSign size={18} className="mr-2" />
//                   Sales
//                 </Link>
//                 <Link
//                   to="/my-profile"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Settings size={18} className="mr-2" />
//                   My Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center space-x-3">
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="password"
//             />
//             <Button 
//               onClick={handleSignIn} 
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 transition-all duration-300 ${
//           isOpen ? "block" : "hidden"
//         } md:hidden`}
//       >
//         {authData ? (
//           <div className="relative w-full px-4">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600 mx-auto"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <LayoutDashboard size={18} className="mr-2" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/my-bookings"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Book size={18} className="mr-2" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   to="/accounts"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <User size={18} className="mr-2" />
//                   Accounts
//                 </Link>
//                 <Link
//                   to="/sales"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <DollarSign size={18} className="mr-2" />
//                   Sales
//                 </Link>
//                 <Link
//                   to="/my-profile"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Settings size={18} className="mr-2" />
//                   My Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-3 w-full px-4">
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//               iconType="password"
//             />
//             <Button 
//               onClick={handleSignIn} 
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold text-center mb-4">OTP Verification</h2>
//             <p className="text-center text-sm mb-4">Enter OTP sent to {email}</p>
//             {otpError && <p className="text-red-500 text-sm text-center mb-2">{otpError}</p>}
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => {
//                 const inputVal = e.target.value.replace(/\D/g, "");
//                 if (inputVal.length <= 6) setOtp(inputVal);
//               }}
//               className="w-full mb-4"
//               showIcon={false}
//             />
//             {isFirstTimeLogin && (
//               <Input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full mb-4"
//                 showIcon={false}
//               />
//             )}
//             <div className="flex justify-end space-x-4">
//               <Button onClick={closeOtpModal} className="bg-gray-300 hover:bg-gray-400">
//                 Cancel
//               </Button>
//               <Button onClick={handleVerifyOtp} className="bg-black hover:bg-gray-800">
//                 Verify
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
//                         px-6 py-3 rounded-full shadow-lg z-50 
//                         max-w-[90%] text-center text-sm sm:text-base">
//           {successMessage}
//         </div>
//       )}
//     </header>
//   );
// }




// //Main working code .....................................................//
// import React, { useState, useEffect } from "react";
// import { Menu, X, LayoutDashboard, Book, User, DollarSign, Settings, LogOut } from "lucide-react";
// import logo from "../assets/images/logo.png";
// import Button from "./Button";
// import { Link, useNavigate } from "react-router-dom";
// import Input from "./Input";
// import { vendorLogin, subvendorLogin, verifyOtp, logoutVendor } from "../services/apiService";
// import { getSubvendorPermissions } from "../services/apiService";
// import { useAuth } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";


// export default function Navbar({ onLoginSuccess }) {
//   const { authData, login, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userType, setUserType] = useState("vendor");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem("vendor_token");
//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Math.floor(Date.now() / 1000);
//           if (decoded.exp < currentTime) {
//             logout();
//             localStorage.removeItem("vendor_token");
//             localStorage.removeItem("subvendor_permissions");
//             setIsDropdownOpen(false);
//             setIsOpen(false);
//             navigate("/");
//             setSuccessMessage("Session expired. Please log in again.");
//             setTimeout(() => setSuccessMessage(""), 3000);
//           }
//         } catch (e) {
//           console.error("Failed to decode token:", e);
//           localStorage.removeItem("vendor_token");
//           localStorage.removeItem("subvendor_permissions");
//           logout();
//           navigate("/");
//         }
//       }
//     };

//     checkTokenExpiration();
//     const interval = setInterval(checkTokenExpiration, 60000);
//     return () => clearInterval(interval);
//   }, [logout, navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem("vendor_token");
//     if (token && !authData) {
//       try {
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || decoded.email.split("@")[0];
//         login({ token, name: userName, email: decoded.email, userType: decoded.userType });

//         if (decoded.userType === "subvendor") {
//           fetchPermissions(decoded.id, token);
//         }
//       } catch (e) {
//         console.error("Failed to decode token:", e);
//         localStorage.removeItem("vendor_token");
//         localStorage.removeItem("subvendor_permissions");
//         logout();
//         navigate("/");
//       }
//     }
//   }, [authData, login]);

//   const fetchPermissions = async (subvendorId, token) => {
//     try {
//       const permissions = await getSubvendorPermissions(token);
//       localStorage.setItem("subvendor_permissions", JSON.stringify(permissions));
//     } catch (err) {
//       console.error("Failed to fetch subvendor permissions:", err);
//     }
//   };

//   const handleSignIn = async () => {
//     try {
//       setError("");
//       setIsLoading(true);

//       if (!email.trim()) {
//         setError("Please enter email");
//         setIsLoading(false);
//         return;
//       }

//       if (!email.includes("@")) {
//         setError("Please enter a valid email address.");
//         setIsLoading(false);
//         return;
//       }

//       if (!password.trim()) {
//         setError("Please enter password.");
//         setIsLoading(false);
//         return;
//       }

//       let response;
//       if (userType === "vendor") {
//         response = await vendorLogin(email, password);
//       } else {
//         response = await subvendorLogin(email, password);
//       }

//       if (response.status === "otp_sent") {
//         setShowOtpModal(true);
//         setIsFirstTimeLogin(userType === "vendor" && response.message.includes("set your password"));
//       } else {
//         throw new Error("Unexpected response from login");
//       }
//     } catch (err) {
//       console.error("Login failed:", err.message, err.stack);
//       if (err.response) {
//         if (err.response.status === 401) {
//           setError("Invalid email or password.");
//         } else if (err.response.status === 403) {
//           setError(err.response.data.error);
//         } else if (err.response.status === 404) {
//           setError("Login endpoint not found. Please contact support.");
//         } else {
//           setError("Login failed. Please try again.");
//         }
//       } else {
//         setError("Network error. Please check your connection.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setOtpError("");

//       if (!otp || otp.length !== 6) {
//         setOtpError("Please enter a valid 6-digit OTP.");
//         return;
//       }
//       if (isFirstTimeLogin && !newPassword) {
//         setOtpError("Please provide a new password.");
//         return;
//       }

//       const data = await verifyOtp(email, otp, isFirstTimeLogin ? newPassword : null, userType);
//       console.log("OTP Verification Response:", data);

//       if (data.status === "password_changed" || data.status === "logged_in") {
//         const token = data.session_id;
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || email.split("@")[0];
//         login({ token, name: userName, email: decoded.email, userType: decoded.userType });

//         if (decoded.userType === "subvendor") {
//           await fetchPermissions(decoded.id, token);
//         }

//         setShowOtpModal(false);
//         setOtp("");
//         setNewPassword("");
//         if (onLoginSuccess) onLoginSuccess();
//         navigate("/");

//         setSuccessMessage("OTP Verified Successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         throw new Error(data.error || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error("OTP verification failed:", err.message, err.stack);
//       setOtpError(err.message || "Failed to verify OTP. Please try again.");
//     }
//   };

//   const closeOtpModal = () => {
//     setShowOtpModal(false);
//     setOtp("");
//     setNewPassword("");
//     setOtpError("");
//     setIsFirstTimeLogin(false);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await logoutVendor();
//       // Handle both server-side and client-side logout success
//       if (response.status === 'success') {
//         logout();
//         localStorage.removeItem("vendor_token");
//         localStorage.removeItem("subvendor_permissions");
//         setIsDropdownOpen(false);
//         setIsOpen(false);
//         navigate("/");
//         setSuccessMessage("Logged out successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         throw new Error("Logout failed");
//       }
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//       setError("Failed to logout. Please try again.");
//       setTimeout(() => setError(""), 3000);
//       // Fallback to client-side logout if server fails
//       logout();
//       localStorage.removeItem("vendor_token");
//       localStorage.removeItem("subvendor_permissions");
//       setIsDropdownOpen(false);
//       setIsOpen(false);
//       navigate("/");
//     }
//   };

//   return (
//     <header className="w-full flex flex-col md:flex-row justify-between items-center py-3 px-4 sm:px-6 bg-white shadow-md relative">
//       {/* Logo and Mobile Menu Button */}
//       <div className="flex justify-between items-center w-full md:w-auto">
//         <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
//         <button className="md:hidden text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Desktop Navigation and Auth */}
//       <div className="hidden md:flex items-center space-x-4">
//         {authData ? (
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <LayoutDashboard size={18} className="mr-2" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/my-bookings"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Book size={18} className="mr-2" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   to="/accounts"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <User size={18} className="mr-2" />
//                   Accounts
//                 </Link>
//                 <Link
//                   to="/sales"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <DollarSign size={18} className="mr-2" />
//                   Sales
//                 </Link>
//                 <Link
//                   to="/my-profile"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Settings size={18} className="mr-2" />
//                   My Profile
//                 </Link>
//                 {authData.userType === "vendor" && (
//                   <Link
//                     to="/user-management"
//                     className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     <User size={18} className="mr-2" />
//                     User Management
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center space-x-3">
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className="border border-gray-300 rounded-md p-2"
//             >
//               <option value="vendor">Vendor</option>
//               <option value="subvendor">Subvendor</option>
//             </select>
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="password"
//             />
//             <Button 
//               onClick={handleSignIn} 
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 transition-all duration-300 ${
//           isOpen ? "block" : "hidden"
//         } md:hidden`}
//       >
//         {authData ? (
//           <div className="relative w-full px-4">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600 mx-auto"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <LayoutDashboard size={18} className="mr-2" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to="/my-bookings"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Book size={18} className="mr-2" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   to="/accounts"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <User size={18} className="mr-2" />
//                   Accounts
//                 </Link>
//                 <Link
//                   to="/sales"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <DollarSign size={18} className="mr-2" />
//                   Sales
//                 </Link>
//                 <Link
//                   to="/my-profile"
//                   className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsDropdownOpen(false)}
//                 >
//                   <Settings size={18} className="mr-2" />
//                   My Profile
//                 </Link>
//                 {authData.userType === "vendor" && (
//                   <Link
//                     to="/user-management"
//                     className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     <User size={18} className="mr-2" />
//                     User Management
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-3 w-full px-4">
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             >
//               <option value="vendor">Vendor</option>
//               <option value="subvendor">Subvendor</option>
//             </select>
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//               iconType="password"
//             />
//             <Button 
//               onClick={handleSignIn} 
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold text-center mb-4">OTP Verification</h2>
//             <p className="text-center text-sm mb-4">Enter OTP sent to {email}</p>
//             {otpError && <p className="text-red-500 text-sm text-center mb-2">{otpError}</p>}
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => {
//                 const inputVal = e.target.value.replace(/\D/g, "");
//                 if (inputVal.length <= 6) setOtp(inputVal);
//               }}
//               className="w-full mb-4"
//               showIcon={false}
//             />
//             {isFirstTimeLogin && (
//               <Input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full mb-4"
//                 showIcon={false}
//               />
//             )}
//             <div className="flex justify-end space-x-4">
//               <Button onClick={closeOtpModal} className="bg-gray-300 hover:bg-gray-400">
//                 Cancel
//               </Button>
//               <Button onClick={handleVerifyOtp} className="bg-black hover:bg-gray-800">
//                 Verify
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
//                         px-6 py-3 rounded-full shadow-lg z-50 
//                         max-w-[90%] text-center text-sm sm:text-base">
//           {successMessage}
//         </div>
//       )}
//       {error && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white 
//                         px-6 py-3 rounded-full shadow-lg z-50 
//                         max-w-[90%] text-center text-sm sm:text-base">
//           {error}
//         </div>
//       )}
//     </header>
//   );
// }

//This code to implemetn user management or sunbvendor management
// import React, { useState, useEffect } from "react";
// import { Menu, X, LayoutDashboard, Book, User, DollarSign, Settings, LogOut } from "lucide-react";
// import logo from "../assets/images/logo.png";
// import Button from "./Button";
// import { Link, useNavigate } from "react-router-dom";
// import Input from "./Input";
// import { vendorLogin, subvendorLogin, verifyOtp, logoutVendor } from "../services/apiService";
// import { getSubvendorPermissions } from "../services/apiService";
// import { useAuth } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";

// // Define navigation tabs
// const navTabs = [
//   { name: "Dashboard", icon: <LayoutDashboard size={18} className="mr-2" />, path: "/dashboard", permissionName: "Dashboard" },
//   { name: "My Bookings", icon: <Book size={18} className="mr-2" />, path: "/my-bookings", permissionName: "My Bookings" },
//   { name: "Accounts", icon: <User size={18} className="mr-2" />, path: "/accounts", permissionName: "Accounts" },
//   { name: "Sales", icon: <DollarSign size={18} className="mr-2" />, path: "/sales", permissionName: "Sales" },
//   { name: "My Profile", icon: <Settings size={18} className="mr-2" />, path: "/my-profile", permissionName: "My Profile" },
//   { name: "User Management", icon: <User size={18} className="mr-2" />, path: "/user-management", permissionName: "User Management" },
// ];

// export default function Navbar({ onLoginSuccess }) {
//   const { authData, login, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userType, setUserType] = useState("vendor");
//   const navigate = useNavigate();

//   // State for country and currency dropdown
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState({ name: "India", currency_code: "INR", currency_name: "Indian Rupee" });
//   const [tempCurrency, setTempCurrency] = useState("Indian Rupee");

//   // Get permissions for subvendors
//   const permissions = authData?.userType === "subvendor"
//     ? JSON.parse(localStorage.getItem("subvendor_permissions") || "[]")
//     : [];

//   // Filter tabs based on permissions for subvendors
//   const filteredTabs = authData?.userType === "subvendor"
//     ? navTabs.filter(tab => {
//         if (tab.name === "User Management") return false; // Subvendors can't access User Management
//         const perm = permissions.find(p => p.name === tab.permissionName);
//         return perm && (perm.can_view || perm.can_manage);
//       })
//     : navTabs;

//     // Fetch all countries on component mount
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/countries"); // Replace with your backend URL
//         const data = await response.json();
//         if (data.status === "success") {
//           setCountries(data.countries);
//           // Set default country (e.g., India)
//           const defaultCountry = data.countries.find(country => country.name === "India") || data.countries[0];
//           if (defaultCountry) {
//             setSelectedCountry(defaultCountry);
//             setTempCurrency(defaultCountry.currency_name);
//           }
//         } else {
//           setError("Failed to fetch countries");
//         }
//       } catch (err) {
//         setError("Error fetching countries");
//       }
//     };

//     fetchCountries();
//   }, []);

//   // Handle Apply button in the country/currency dropdown
//   const handleApplyCountrySettings = async () => {
//     try {
//       const selectedCountryData = countries.find(country => country.name === selectedCountry.name);
//       if (!selectedCountryData) return;

//       const response = await fetch(`http://localhost:5000/api/${selectedCountry.name}/currency`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           currency_name: tempCurrency,
//           currency_code: selectedCountryData.currency_code, // You might need to map this based on tempCurrency
//           currency_symbol: selectedCountryData.currency_symbol, // Adjust based on your logic
//         }),
//       });

//       const data = await response.json();
//       if (data.status === "success") {
//         setSelectedCountry(data.country);
//         setIsCountryDropdownOpen(false);
//         setSuccessMessage("Country settings updated successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         setError("Failed to update country settings");
//       }
//     } catch (err) {
//       setError("Error updating country settings");
//     }
//   };

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem("vendor_token");
//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Math.floor(Date.now() / 1000);
//           if (decoded.exp < currentTime) {
//             logout();
//             localStorage.removeItem("vendor_token");
//             localStorage.removeItem("subvendor_permissions");
//             setIsDropdownOpen(false);
//             setIsOpen(false);
//             navigate("/");
//             setSuccessMessage("Session expired. Please log in again.");
//             setTimeout(() => setSuccessMessage(""), 3000);
//           }
//         } catch (e) {
//           console.error("Failed to decode token:", e);
//           localStorage.removeItem("vendor_token");
//           localStorage.removeItem("subvendor_permissions");
//           logout();
//           navigate("/");
//         }
//       }
//     };

//     checkTokenExpiration();
//     const interval = setInterval(checkTokenExpiration, 60000);
//     return () => clearInterval(interval);
//   }, [logout, navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem("vendor_token");
//     if (token && !authData) {
//       try {
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || decoded.email.split("@")[0];
//         login({ token, name: userName, email: decoded.email, userType: decoded.userType });

//         if (decoded.userType === "subvendor") {
//           fetchPermissions(decoded.id, token);
//         }
//       } catch (e) {
//         console.error("Failed to decode token:", e);
//         localStorage.removeItem("vendor_token");
//         localStorage.removeItem("subvendor_permissions");
//         logout();
//         navigate("/");
//       }
//     }
//   }, [authData, login]);

//   const fetchPermissions = async (subvendorId, token) => {
//     try {
//       const permissions = await getSubvendorPermissions(token);
//       localStorage.setItem("subvendor_permissions", JSON.stringify(permissions));
//     } catch (err) {
//       console.error("Failed to fetch subvendor permissions:", err);
//     }
//   };

//   const handleSignIn = async () => {
//     try {
//       setError("");
//       setIsLoading(true);

//       if (!email.trim()) {
//         setError("Please enter email");
//         setIsLoading(false);
//         return;
//       }

//       if (!email.includes("@")) {
//         setError("Please enter a valid email address.");
//         setIsLoading(false);
//         return;
//       }

//       if (!password.trim()) {
//         setError("Please enter password.");
//         setIsLoading(false);
//         return;
//       }

//       let response;
//       if (userType === "vendor") {
//         response = await vendorLogin(email, password);
//       } else {
//         response = await subvendorLogin(email, password);
//       }

//       if (response.status === "otp_sent") {
//         setShowOtpModal(true);
//         setIsFirstTimeLogin(userType === "vendor" && response.message.includes("set your password"));
//       } else {
//         throw new Error("Unexpected response from login");
//       }
//     } catch (err) {
//       console.error("Login failed:", err.message, err.stack);
//       if (err.response) {
//         if (err.response.status === 401) {
//           setError("Invalid email or password.");
//         } else if (err.response.status === 403) {
//           setError(err.response.data.error);
//         } else if (err.response.status === 404) {
//           setError("Login endpoint not found. Please contact support.");
//         } else {
//           setError("Login failed. Please try again.");
//         }
//       } else {
//         setError("Network error. Please check your connection.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setOtpError("");

//       if (!otp || otp.length !== 6) {
//         setOtpError("Please enter a valid 6-digit OTP.");
//         return;
//       }
//       if (isFirstTimeLogin && !newPassword) {
//         setOtpError("Please provide a new password.");
//         return;
//       }

//       const data = await verifyOtp(email, otp, isFirstTimeLogin ? newPassword : null, userType);
//       console.log("OTP Verification Response:", data);

//       if (data.status === "password_changed" || data.status === "logged_in") {
//         const token = data.session_id;
//         const decoded = jwtDecode(token);
//         const userName = decoded.name || email.split("@")[0];
//         login({ token, name: userName, email: decoded.email, userType: decoded.userType });

//         if (decoded.userType === "subvendor") {
//           await fetchPermissions(decoded.id, token);
//         }

//         setShowOtpModal(false);
//         setOtp("");
//         setNewPassword("");
//         if (onLoginSuccess) onLoginSuccess();
//         navigate("/");

//         setSuccessMessage("OTP Verified Successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         throw new Error(data.error || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error("OTP verification failed:", err.message, err.stack);
//       setOtpError(err.message || "Failed to verify OTP. Please try again.");
//     }
//   };

//   const closeOtpModal = () => {
//     setShowOtpModal(false);
//     setOtp("");
//     setNewPassword("");
//     setOtpError("");
//     setIsFirstTimeLogin(false);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await logoutVendor();
//       if (response.status === "success") {
//         logout();
//         localStorage.removeItem("vendor_token");
//         localStorage.removeItem("subvendor_permissions");
//         setIsDropdownOpen(false);
//         setIsOpen(false);
//         navigate("/");
//         setSuccessMessage("Logged out successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         throw new Error("Logout failed");
//       }
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//       setError("Failed to logout. Please try again.");
//       setTimeout(() => setError(""), 3000);
//       logout();
//       localStorage.removeItem("vendor_token");
//       localStorage.removeItem("subvendor_permissions");
//       setIsDropdownOpen(false);
//       setIsOpen(false);
//       navigate("/");
//     }
//   };

//   return (
//     <header className="w-full flex flex-col md:flex-row justify-between items-center py-3 px-4 sm:px-6 bg-white shadow-md relative">
//       {/* Logo and Mobile Menu Button */}
//       <div className="flex justify-between items-center w-full md:w-auto">
//         <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
//         <button className="md:hidden text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>
//     {/* Country and Currency Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
//             className="flex items-center space-x-1 text-gray-600 border border-gray-300 rounded-md px-3 py-1"
//           >
//             <span>{selectedCountry.name}</span>
//             <span>{selectedCountry.currency_code}</span>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg>
//           </button>
//           {isCountryDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-semibold">Country</span>
//                 <button onClick={() => setIsCountryDropdownOpen(false)}>
//                   <X size={18} />
//                 </button>
//               </div>
//               <select
//                 value={selectedCountry.name}
//                 onChange={(e) => {
//                   const country = countries.find(c => c.name === e.target.value);
//                   setSelectedCountry(country);
//                   setTempCurrency(country.currency_name);
//                 }}
//                 className="w-full border border-gray-300 rounded-md p-2 mb-2"
//               >
//                 {countries.map(country => (
//                   <option key={country.name} value={country.name}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>

//               <span className="font-semibold">Currency</span>
//               <select
//                 value={tempCurrency}
//                 onChange={(e) => setTempCurrency(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 mb-4"
//               >
//                 {/* Add more currency options as needed */}
//                 <option value="Indian Rupee">INR - Indian Rupee</option>
//                 <option value="US Dollar">USD - US Dollar</option>
//                 <option value="Euro">EUR - Euro</option>
//               </select>

//               <Button
//                 onClick={handleApplyCountrySettings}
//                 className="w-full bg-gray-300 hover:bg-gray-400 text-black rounded-md py-2"
//               >
//                 Apply
//               </Button>
//             </div>
//           )}
//         </div>
//       {/* Desktop Navigation and Auth */}
//       <div className="hidden md:flex items-center space-x-4">
//         {authData ? (
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//                 {filteredTabs.map((tab) => (
//                   <Link
//                     key={tab.name}
//                     to={tab.path}
//                     className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     {tab.icon}
//                     {tab.name}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center space-x-3">
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className="border border-gray-300 rounded-md p-2"
//             >
//               <option value="vendor">Vendor</option>
//               <option value="subvendor">Subvendor</option>
//             </select>
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-32 lg:w-40"
//               iconType="password"
//             />
//             <Button
//               onClick={handleSignIn}
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>
//       {/* Country and Currency Dropdown */}
//         {/* <div className="relative">
//           <button
//             onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
//             className="flex items-center space-x-1 text-gray-600 border border-gray-300 rounded-md px-3 py-1"
//           >
//             <span>{selectedCountry.name}</span>
//             <span>{selectedCountry.currency_code}</span>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg>
//           </button>
//           {isCountryDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-semibold">Country</span>
//                 <button onClick={() => setIsCountryDropdownOpen(false)}>
//                   <X size={18} />
//                 </button>
//               </div>
//               <select
//                 value={selectedCountry.name}
//                 onChange={(e) => {
//                   const country = countries.find(c => c.name === e.target.value);
//                   setSelectedCountry(country);
//                   setTempCurrency(country.currency_name);
//                 }}
//                 className="w-full border border-gray-300 rounded-md p-2 mb-2"
//               >
//                 {countries.map(country => (
//                   <option key={country.name} value={country.name}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>

//               <span className="font-semibold">Currency</span>
//               <select
//                 value={tempCurrency}
//                 onChange={(e) => setTempCurrency(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 mb-4"
//               > */}
//                 {/* Add more currency options as needed */}
//                 {/* <option value="Indian Rupee">INR - Indian Rupee</option>
//                 <option value="US Dollar">USD - US Dollar</option>
//                 <option value="Euro">EUR - Euro</option>
//               </select>

//               <Button
//                 onClick={handleApplyCountrySettings}
//                 className="w-full bg-gray-300 hover:bg-gray-400 text-black rounded-md py-2"
//               >
//                 Apply
//               </Button>
//             </div>
//           )}
//         </div> */}

//       {/* Mobile Menu */}
//       <div
//         className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 transition-all duration-300 ${
//           isOpen ? "block" : "hidden"
//         } md:hidden`}
//       >
//         {authData ? (
//           <div className="relative w-full px-4">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-600 mx-auto"
//             >
//               <span>{authData.name}</span>
//               <span className="bg-gray-200 text-gray-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
//                 {authData.name.charAt(0).toUpperCase()}
//               </span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//                 {filteredTabs.map((tab) => (
//                   <Link
//                     key={tab.name}
//                     to={tab.path}
//                     className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     {tab.icon}
//                     {tab.name}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-3 w-full px-4">
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             >
//               <option value="vendor">Vendor</option>
//               <option value="subvendor">Subvendor</option>
//             </select>
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full"
//               iconType="username"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//               iconType="password"
//             />
//             <Button
//               onClick={handleSignIn}
//               className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>
//         )}
//       </div>

      
//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold text-center mb-4">OTP Verification</h2>
//             <p className="text-center text-sm mb-4">Enter OTP sent to {email}</p>
//             {otpError && <p className="text-red-500 text-sm text-center mb-2">{otpError}</p>}
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => {
//                 const inputVal = e.target.value.replace(/\D/g, "");
//                 if (inputVal.length <= 6) setOtp(inputVal);
//               }}
//               className="w-full mb-4"
//               showIcon={false}
//             />
//             {isFirstTimeLogin && (
//               <Input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full mb-4"
//                 showIcon={false}
//               />
//             )}
//             <div className="flex justify-end space-x-4">
//               <Button onClick={closeOtpModal} className="bg-gray-300 hover:bg-gray-400">
//                 Cancel
//               </Button>
//               <Button onClick={handleVerifyOtp} className="bg-black hover:bg-gray-800">
//                 Verify
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
//                         px-6 py-3 rounded-full shadow-lg z-50 
//                         max-w-[90%] text-center text-sm sm:text-base">
//           {successMessage}
//         </div>
//       )}
//       {error && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white 
//                         px-6 py-3 rounded-full shadow-lg z-50 
//                         max-w-[90%] text-center text-sm sm:text-base">
//           {error}
//         </div>
//       )}
//     </header>
//   );
// }


//country Implements
import React, { useState, useEffect, useContext } from "react";
import { Menu, X, LayoutDashboard, Book, User, DollarSign, Settings, LogOut } from "lucide-react";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import { vendorLogin, subvendorLogin, verifyOtp, logoutVendor } from "../services/apiService";
import { getSubvendorPermissions } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { CountryContext } from "../context/CountryContext";
import { jwtDecode } from "jwt-decode";

// Define navigation tabs
const navTabs = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} className="mr-2" />, path: "/dashboard", permissionName: "Dashboard" },
  { name: "My Bookings", icon: <Book size={18} className="mr-2" />, path: "/my-bookings", permissionName: "My Bookings" },
  { name: "Accounts", icon: <User size={18} className="mr-2" />, path: "/accounts", permissionName: "Accounts" },
  { name: "Sales", icon: <DollarSign size={18} className="mr-2" />, path: "/sales", permissionName: "Sales" },
  { name: "My Profile", icon: <Settings size={18} className="mr-2" />, path: "/my-profile", permissionName: "My Profile" },
  { name: "User Management", icon: <User size={18} className="mr-2" />, path: "/user-management", permissionName: "User Management" },
];

export default function Navbar({ onLoginSuccess }) {
  const { authData, login, logout } = useAuth();
  const { countries, selectedCountry, setSelectedCountry, tempCurrency, setTempCurrency } = useContext(CountryContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("vendor");
  const navigate = useNavigate();

  // Get permissions for subvendors
  const permissions = authData?.userType === "subvendor"
    ? JSON.parse(localStorage.getItem("subvendor_permissions") || "[]")
    : [];

  // Filter tabs based on permissions for subvendors
  const filteredTabs = authData?.userType === "subvendor"
    ? navTabs.filter(tab => {
        if (tab.name === "User Management") return false;
        const perm = permissions.find(p => p.name === tab.permissionName);
        return perm && (perm.can_view || perm.can_manage);
      })
    : navTabs;

  // Handle Apply button in the country/currency dropdown
  const handleApplyCountrySettings = async () => {
    try {
      const selectedCountryData = countries.find(country => country.name === selectedCountry.name);
      if (!selectedCountryData) return;

      const response = await fetch(`https://vendor-f6gw.onrender.com/api/${selectedCountry.name}/currency`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency_name: tempCurrency,
          currency_code: selectedCountryData.currency_code,
          currency_symbol: selectedCountryData.currency_symbol,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSelectedCountry(data.country);
        setIsCountryDropdownOpen(false);
        // Save the updated country to localStorage for persistence
        localStorage.setItem("selectedCountry", JSON.stringify(data.country));
        setSuccessMessage("Country settings updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Failed to update country settings");
      }
    } catch (err) {
      setError("Error updating country settings");
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("vendor_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            logout();
            localStorage.removeItem("vendor_token");
            localStorage.removeItem("subvendor_permissions");
            setIsDropdownOpen(false);
            setIsOpen(false);
            navigate("/");
            setSuccessMessage("Session expired. Please log in again.");
            setTimeout(() => setSuccessMessage(""), 3000);
          }
        } catch (e) {
          console.error("Failed to decode token:", e);
          localStorage.removeItem("vendor_token");
          localStorage.removeItem("subvendor_permissions");
          logout();
          navigate("/");
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [logout, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("vendor_token");
    if (token && !authData) {
      try {
        const decoded = jwtDecode(token);
        const userName = decoded.name || decoded.email.split("@")[0];
        login({ token, name: userName, email: decoded.email, userType: decoded.userType });

        if (decoded.userType === "subvendor") {
          fetchPermissions(decoded.id, token);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
        localStorage.removeItem("vendor_token");
        localStorage.removeItem("subvendor_permissions");
        logout();
        navigate("/");
      }
    }
  }, [authData, login]);

  const fetchPermissions = async (subvendorId, token) => {
    try {
      const permissions = await getSubvendorPermissions(token);
      localStorage.setItem("subvendor_permissions", JSON.stringify(permissions));
    } catch (err) {
      console.error("Failed to fetch subvendor permissions:", err);
    }
  };

  const handleSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);

      if (!email.trim()) {
        setError("Please enter email");
        setIsLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        setError("Please enter password.");
        setIsLoading(false);
        return;
      }

      let response;
      if (userType === "vendor") {
        response = await vendorLogin(email, password);
      } else {
        response = await subvendorLogin(email, password);
      }

      if (response.status === "otp_sent") {
        setShowOtpModal(true);
        setIsFirstTimeLogin(userType === "vendor" && response.message.includes("set your password"));
      } else {
        throw new Error("Unexpected response from login");
      }
    } catch (err) {
      console.error("Login failed:", err.message, err.stack);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 403) {
          setError(err.response.data.error);
        } else if (err.response.status === 404) {
          setError("Login endpoint not found. Please contact support.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpError("");

      if (!otp || otp.length !== 6) {
        setOtpError("Please enter a valid 6-digit OTP.");
        return;
      }
      if (isFirstTimeLogin && !newPassword) {
        setOtpError("Please provide a new password.");
        return;
      }

      const data = await verifyOtp(email, otp, isFirstTimeLogin ? newPassword : null, userType);
      console.log("OTP Verification Response:", data);

      if (data.status === "password_changed" || data.status === "logged_in") {
        const token = data.session_id;
        const decoded = jwtDecode(token);
        const userName = decoded.name || email.split("@")[0];
        login({ token, name: userName, email: decoded.email, userType: decoded.userType });

        if (decoded.userType === "subvendor") {
          await fetchPermissions(decoded.id, token);
        }

        setShowOtpModal(false);
        setOtp("");
        setNewPassword("");
        if (onLoginSuccess) onLoginSuccess();
        navigate("/");

        setSuccessMessage("OTP Verified Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.error || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP verification failed:", err.message, err.stack);
      setOtpError(err.message || "Failed to verify OTP. Please try again.");
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setNewPassword("");
    setOtpError("");
    setIsFirstTimeLogin(false);
  };

  const handleLogout = async () => {
    try {
      const response = await logoutVendor();
      if (response.status === "success") {
        logout();
        localStorage.removeItem("vendor_token");
        localStorage.removeItem("subvendor_permissions");
        setIsDropdownOpen(false);
        setIsOpen(false);
        navigate("/");
        setSuccessMessage("Logged out successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout failed:", err.message);
      setError("Failed to logout. Please try again.");
      setTimeout(() => setError(""), 3000);
      logout();
      localStorage.removeItem("vendor_token");
      localStorage.removeItem("subvendor_permissions");
      setIsDropdownOpen(false);
      setIsOpen(false);
      navigate("/");
    }
  };

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-center py-3 px-4 sm:px-6 bg-white shadow-md relative">
      {/* Logo and Mobile Menu Button */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
        <button className="md:hidden text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Country and Currency Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
          className="flex items-center space-x-1 text-gray-600 border border-gray-300 rounded-md px-3 py-1"
        >
          <span>{selectedCountry.name}</span>
          <span>{selectedCountry.currency_code}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isCountryDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Country</span>
              <button onClick={() => setIsCountryDropdownOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <select
              value={selectedCountry.name}
              onChange={(e) => {
                const country = countries.find(c => c.name === e.target.value);
                setSelectedCountry(country);
                setTempCurrency(country.currency_name);
              }}
              className="w-full border border-gray-300 rounded-md p-2 mb-2"
            >
              {countries.map(country => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <span className="font-semibold">Currency</span>
            <select
              value={tempCurrency}
              onChange={(e) => setTempCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            >
              <option value="Indian Rupee">INR - Indian Rupee</option>
              <option value="US Dollar">USD - US Dollar</option>
              <option value="Euro">EUR - Euro</option>
            </select>

            <Button
              onClick={handleApplyCountrySettings}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black rounded-md py-2"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      {/* Desktop Navigation and Auth */}
      <div className="hidden md:flex items-center space-x-4">
        {authData ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600"
            >
              <span>{authData.name}</span>
              <span className="bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center">
                {authData.name.charAt(0).toUpperCase()}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                {filteredTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    to={tab.path}
                    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {tab.icon}
                    {tab.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="vendor">Vendor</option>
              <option value="subvendor">Subvendor</option>
            </select>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-32 lg:w-40"
              iconType="username"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-32 lg:w-40"
              iconType="password"
            />
            <Button
              onClick={handleSignIn}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        } md:hidden`}
      >
        {authData ? (
          <div className="relative w-full px-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 mx-auto"
            >
              <span>{authData.name}</span>
              <span className="bg-gray-200 text-gray-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
                {authData.name.charAt(0).toUpperCase()}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                {filteredTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    to={tab.path}
                    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {tab.icon}
                    {tab.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 w-full px-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="vendor">Vendor</option>
              <option value="subvendor">Subvendor</option>
            </select>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              iconType="username"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              iconType="password"
            />
            <Button
              onClick={handleSignIn}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-center mb-4">OTP Verification</h2>
            <p className="text-center text-sm mb-4">Enter OTP sent to {email}</p>
            {otpError && <p className="text-red-500 text-sm text-center mb-2">{otpError}</p>}
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const inputVal = e.target.value.replace(/\D/g, "");
                if (inputVal.length <= 6) setOtp(inputVal);
              }}
              className="w-full mb-4"
              showIcon={false}
            />
            {isFirstTimeLogin && (
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mb-4"
                showIcon={false}
              />
            )}
            <div className="flex justify-end space-x-4">
              <Button onClick={closeOtpModal} className="bg-gray-300 hover:bg-gray-400">
                Cancel
              </Button>
              <Button onClick={handleVerifyOtp} className="bg-black hover:bg-gray-800">
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white 
                        px-6 py-3 rounded-full shadow-lg z-50 
                        max-w-[90%] text-center text-sm sm:text-base">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white 
                        px-6 py-3 rounded-full shadow-lg z-50 
                        max-w-[90%] text-center text-sm sm:text-base">
          {error}
        </div>
      )}
    </header>
  );
}