import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

// Helper function to get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem("vendor_token");
  console.log("Get Token - Retrieved Token:", token);
  return token;
};

// Helper function to set the token in localStorage
const setToken = (token) => {
  console.log("Set Token - Storing Token:", token);
  localStorage.setItem("vendor_token", token);
};

// Helper function to remove the token from localStorage
const removeToken = () => {
  console.log("Remove Token - Removing Token");
  localStorage.removeItem("vendor_token");
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.clone().text(); // Clone to avoid consuming the stream
    try {
      const errorData = JSON.parse(text);
      console.error("Server error details:", errorData);
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status} Error: ${text.substring(0, 100)}...`);
    } catch (e) {
      throw new Error(`Server error: Unable to parse response - ${text.substring(0, 100)}...`);
    }
  }
  const data = await response.json();
  if (data.session_id) {
    setToken(data.session_id); // Store the session_id if present
  }
  return data;
};

// User Authentication APIs
export const vendorLogin = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/user/vendor/login`, { email, password });
  return response.data;
};

export const subvendorLogin = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/user/subvendor/login`, { email, password });
  return response.data;
};

export const verifyOtp = async (email, otp, newPassword, userType) => {
  const response = await axios.post(`${BASE_URL}/user/verify-otp`, { email, otp, newPassword, userType });
  return response.data;
};

export const getSubvendorPermissions = async (token) => {
  const response = await axios.get(`${BASE_URL}/user/subvendor/permissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logoutVendor = async () => {
  console.log("Sending logout request to:", `${BASE_URL}/user/logout`);
  const response = await fetch(`${BASE_URL}/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  removeToken();
  return handleResponse(response);
};

// Flight Search API
export const searchFlights = async (origin, destination, date, returnDate) => {
  const queryParams = new URLSearchParams({
    origin,
    destination,
    date,
  });

  if (returnDate) {
    queryParams.append("returnDate", returnDate);
  }

  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/search?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Live Airport Search API
export const liveAirportSearch = async (term) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/live-airport-search?term=${encodeURIComponent(term)}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Price Flight API
export const priceFlight = async (flightOffer) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/price`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flightOffer }),
  });
  return handleResponse(response);
};

// Seat Map API
export const getSeatMap = async (pricedOffer) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/seatmap`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pricedOffer }),
  });
  return handleResponse(response);
};

// Book Flight API
export const bookFlight = async (pricedOffer, travelers, addons, gstin) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/book`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pricedOffer, travelers, addons, gstin }),
  });
  return handleResponse(response);
};

// Confirm Booking API
export const confirmBooking = async (paymentId, orderId, signature, pricedOffer, travelers, bookingId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/flights/confirm-booking`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentId, orderId, signature, pricedOffer, travelers, bookingId }),
  });
  return handleResponse(response);
};

// Get Bookings API
export const getBookings = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Get Booking By ID API
export const getBookingById = async (amadeusOrderId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(amadeusOrderId)}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Cancel Booking API
export const cancelBooking = async (amadeusOrderId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(amadeusOrderId)}/cancel`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Get Invoice API
export const getInvoice = async (amadeusOrderId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(amadeusOrderId)}/invoice`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};





// export const vendorLogin = async (email, password) => {
//   const response = await axios.post(`${BASE_URL}/user/vendor/login`, { email, password });
//   return response.data;
// };

// export const subvendorLogin = async (email, password) => {
//   const response = await axios.post('http://localhost:5000/api/user/subvendor/login', { email, password });
//   return response.data;
// };

// export const verifyOtp = async (email, otp, newPassword, userType) => {
//   const response = await axios.post('http://localhost:5000/api/user/verify-otp', { email, otp, newPassword, userType });
//   return response.data;
// };




// export const getSubvendorPermissions = async (token) => {
//   const response = await axios.get('http://localhost:5000/api/user/subvendor/permissions', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };
