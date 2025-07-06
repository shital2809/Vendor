// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import { logoutVendor } from "./services/apiService";
// import FlightBooking from "./components/FlightBooking";
// import FlightResult from "./pages/FligthResults";
// import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/Dashboard";
// import MyBookings from "./pages/MyBookings";
// import Accounts from "./pages/Accounts";
// import Sales from "./pages/Sales";
// import Profile from "./pages/Profile";
// import BookingResponse from "./pages/BookingResponse";
// import UserManagement from "./pages/UserManagement";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [vendorData, setVendorData] = useState(null);

//   const handleLoginSuccess = (vendor) => {
//     console.log("Login success - Vendor data:", vendor);
//     setIsAuthenticated(true);
//     setVendorData(vendor);
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutVendor();
//       setIsAuthenticated(false);
//       setVendorData(null);
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//     }
//   };

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Home
//                 onLoginSuccess={handleLoginSuccess}
//                 vendorData={vendorData}
//                 onLogout={handleLogout}
//                 setVendorData={setVendorData} // Pass setVendorData to Navbar
//               />
//             }
//           />
//           <Route path="/flight-results" element={<FlightResult />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/my-bookings" element={<MyBookings />} />
//           <Route path="/accounts" element={<Accounts />} />
//           <Route path="/sales" element={<Sales />} />
//           <Route path="/my-profile" element={<Profile />} />
//           <Route path="/booking" element={<BookingResponse/>} />
//           <Route path="/user-management" element={<UserManagement />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;



//Updated code with remiving unused imports and fixing the import statement for AuthProvider
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import FlightResult from "./pages/FligthResults";
// import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/Dashboard";
// import MyBookings from "./pages/MyBookings";
// import Accounts from "./pages/Accounts";
// import Sales from "./pages/Sales";
// import Profile from "./pages/Profile";
// import BookingResponse from "./pages/BookingResponse";
// import UserManagement from "./pages/UserManagement";

// const App = () => {

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Home/>
//             }
//           />
//           <Route path="/flight-results" element={<FlightResult />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/my-bookings" element={<MyBookings />} />
//           <Route path="/accounts" element={<Accounts />} />
//           <Route path="/sales" element={<Sales />} />
//           <Route path="/my-profile" element={<Profile />} />
//           <Route path="/booking" element={<BookingResponse/>} />
//           <Route path="/user-management" element={<UserManagement />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FlightResult from "./pages/FligthResults";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CountryProvider } from "./context/CountryContext";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import Accounts from "./pages/Accounts";
import Sales from "./pages/Sales";
import Profile from "./pages/Profile";
import BookingResponse from "./pages/BookingResponse";
import UserManagement from "./pages/UserManagement";

// ProtectedRoute component to handle authentication checks
const ProtectedRoute = ({ children, vendorOnly}) => {
  const { authData } = useAuth();

  // If user is not authenticated, redirect to home page
  if (!authData) {
    return <Navigate to="/" replace />;
  }
  if (vendorOnly && authData.userType !== 'vendor') {
    return <Navigate to="/dashboard" />;
  }
  // If user is authenticated, render the protected component
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CountryProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flight-results" element={<FlightResult />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <Accounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingResponse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute vendorOnly>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </CountryProvider>
    </AuthProvider>
  );
};

export default App;



