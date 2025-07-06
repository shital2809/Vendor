const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const masterDataRoutes = require("./routes/masterDataRoutes");
const countryRoutes = require("./routes/countryRoutes");
const path = require("path");
const cors = require("cors");


dotenv.config();
const app = express();


app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://vendor-user.netlify.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://super-admin-ga55.onrender.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(express.json());
app.use("/api/user", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api", flightRoutes);
app.use("/api/user", masterDataRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", countryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
