
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-4 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:translate-x-0 md:w-64 md:flex md:flex-col z-50`}
    >
      <ul className="space-y-2">
        <li>
          <Link
            to="/rewards"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>✨</span>
            <span>Rewards & promos</span>
          </Link>
        </li>
        <li>
          <Link
            to="/contact-info"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>📞</span>
            <span>Contact info</span>
          </Link>
        </li>
        <li>
          <Link
            to="/guest-traveler-info"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>👥</span>
            <span>Guest traveler info</span>
          </Link>
        </li>
        <li>
          <Link
            to="/traveler-info"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>👤</span>
            <span>Traveler info</span>
          </Link>
        </li>
        <li>
          <Link
            to="/payment-methods"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>💳</span>
            <span>Payment methods</span>
          </Link>
        </li>
        <li>
          <Link
            to="/airline-credits"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>✈️</span>
            <span>Airline credits</span>
          </Link>
        </li>
        <li>
          <Link
            to="/loyalty-programs"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded"
          >
            <span>🎉</span>
            <span>Loyalty programs</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;