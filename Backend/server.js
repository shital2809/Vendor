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


app.use(cors());
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
