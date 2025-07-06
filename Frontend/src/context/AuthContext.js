// // src/context/AuthContext.js
// import React, { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [authData, setAuthData] = useState(null); // Store user data or token

//   const login = (userData) => {
//     setAuthData(userData);
//     localStorage.setItem("auth_token", userData.token); // Store token in localStorage
//   };

//   const logout = () => {
//     setAuthData(null);
//     localStorage.removeItem("auth_token");
//   };

//   return (
//     <AuthContext.Provider value={{ authData, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('vendor_token', data.token);
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('subvendor_permissions');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);