const express = require("express");
const router = express.Router();
const {
  searchFlights,
  priceFlight,
  liveAirportSearch,
  airportSearch,
  seatMap,
  bookFlight,
  confirmBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getInvoice,
} = require("../controller/flightController");
const { verifyToken } = require("../middleware/authmiddleware");

router.get("/flights/search", verifyToken, searchFlights);
router.post("/flights/price", verifyToken, priceFlight);
router.get("/flights/live-airport-search", verifyToken, liveAirportSearch);
// router.get("/flights/airport-search", verifyToken, airportSearch);
router.post("/flights/seatmap", verifyToken, seatMap);
router.post("/flights/book", verifyToken, bookFlight);
router.post("/flights/confirm-booking", verifyToken, confirmBooking);
router.get("/bookings", verifyToken, getBookings);
router.get("/bookings/:amadeusOrderId", verifyToken, getBookingById);
router.delete("/bookings/:amadeusOrderId/cancel", verifyToken, cancelBooking);
router.get("/bookings/:amadeusOrderId/invoice", verifyToken, getInvoice);

module.exports = router;
