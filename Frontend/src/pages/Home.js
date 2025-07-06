// import React from "react";
// import SearchCard from "../components/SearchCard";
// import Navbar from "../components/Navbar";
// import bgImage from "../assets/images/background.jpg";
// import { useNavigate } from "react-router-dom";

// const Home = ({ onLoginSuccess, adminData, onLogout, setAdminData }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <Navbar
//         // onGetStarted={() => navigate("/admin-signup")} // Example: Redirect to signup page
//         adminData={adminData}
//         onLogout={onLogout}
//         setAdminData={setAdminData} // Pass setAdminData to Navbar
//         onLoginSuccess={onLoginSuccess} // Pass onLoginSuccess to Navbar
//       />

//       <div className="flex-1 flex items-center justify-center w-full px-4">
//         <SearchCard />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import SearchCard from "../components/SearchCard";
import FlightBooking from "../components/FlightBooking";
import Navbar from "../components/Navbar";
import bgImage from "../assets/images/background.jpg";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { authData } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center w-full px-4">
        {authData ? <FlightBooking /> : <SearchCard />}
      </div>
    </div>
  );
};

export default Home;