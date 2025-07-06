
// import React, { useState, useEffect } from "react";
// import Button from "./Button";
// import Input from "./Input";
// import logo from "../assets/images/logo.png";
// import { useNavigate } from "react-router-dom";

// const Card = ({ onBack, setAdminData }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [step, setStep] = useState("login"); // Can be "login" or "otp"
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Initialize email if coming from a specific flow
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await adminLogin(email, password);
//       if (response.status === "otp_sent") {
//         setStep("otp");
//       }
//     } catch (err) {
//       setError(err.message || "Login failed");
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const data = await verifyOtp(email, otp);
//       if (data.status === "verified") {
//         const adminDataToSet = { name: email.split('@')[0], email };
//         setAdminData(adminDataToSet);
//         onBack(adminDataToSet); // Close card and notify parent
//         // navigate("/admin-dashboard");
//       }
//     } catch (err) {
//       setError(err.message || "Invalid or expired OTP");
//     }
//   };

//   const handleBack = () => {
//     if (step === "otp") setStep("login");
//     else onBack();
//   };

//   return (
//     <div className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative">
//       <button
//         className="absolute top-4 left-4 text-gray-600 hover:text-black text-lg sm:text-xl"
//         onClick={handleBack}
//       >
//         ← Back
//       </button>

//       <div className="flex justify-center">
//         <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
//       </div>

//       <h2 className="text-lg sm:text-xl font-semibold text-center">
//         {step === "login" ? "Login" : "OTP Verification"}
//       </h2>

//       {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}

//       {step === "login" ? (
//         <form className="space-y-4" onSubmit={handleLogin}>
//           <Input
//             type="text"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="text-sm sm:text-base"
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="text-sm sm:text-base"
//           />
//           <div className="flex justify-center space-x-4">
//             <Button>Login</Button>
//           </div>
//         </form>
//       ) : (
//         <form className="space-y-4" onSubmit={handleVerifyOtp}>
//           <p className="text-center text-sm">Enter OTP sent to {email}</p>
//           <Input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => {
//               const inputVal = e.target.value.replace(/\D/g, "");
//               if (inputVal.length <= 6) setOtp(inputVal);
//             }}
//             className="text-sm sm:text-base"
//             showIcon={false}
//           />
//           <div className="flex justify-center space-x-4">
//             <Button>Submit</Button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Card;