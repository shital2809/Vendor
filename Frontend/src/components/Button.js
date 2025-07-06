import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, to, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Call custom onClick function if provided
    } else if (to) {
      navigate(to); // Navigate to the specified route
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-black text-white px-4 py-2 rounded-full font-medium ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
