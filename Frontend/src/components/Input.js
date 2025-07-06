

import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react"; // Import icons

const Input = ({ type, placeholder, value, onChange, className, iconType, showIcon = true }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      {showIcon && (
        <div className="bg-black p-3 flex items-center justify-center w-12 rounded-l-lg">
          {iconType === "username" && <User size={20} className="text-white" />}
          {iconType === "password" && <Lock size={20} className="text-white" />}
        </div>
      )}
      {/* Input Field */}
      <input
        type={iconType === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`py-2 pl-4 pr-12 bg-gray-100 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-black ${className} ${showIcon ? "rounded-l-none" : "rounded-lg"}`}
      />
      {/* Eye Icon for Password Field */}
      {iconType === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;