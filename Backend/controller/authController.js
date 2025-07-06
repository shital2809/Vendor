const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateOTP, sendOTP } = require("../services/emailService");

// Vendor Login with Email & Password (First-time Login flow)
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const vendorResult = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );
    const vendor = vendorResult.rows[0];

    if (!vendor) {
      return res.status(404).json({
        status: "not_found",
        message: "Vendor not found",
        email,
      });
    }

    // If it's the vendor's first-time login, send OTP and prompt for password update
    if (!vendor.password_changed) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      // Insert or update OTP for login verification
      await pool.query(
        `
        INSERT INTO otps (user_id, user_type, otp, expires_at) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, user_type) 
        DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at
        `,
        [vendor.id, "vendor", otp, expiresAt]
      );

      // Send OTP to vendor's email
      await sendOTP(vendor.email, otp, "email");

      return res.json({
        status: "otp_sent",
        message: "OTP sent to your email. Please verify to login and set your password.",
      });
    }

    // If the vendor already updated their password, validate the password
    const validPassword = await bcrypt.compare(password, vendor.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate OTP for subsequent login
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Insert or update OTP for login verification
    await pool.query(
      `
      INSERT INTO otps (user_id, user_type, otp, expires_at) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, user_type) 
      DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at
      `,
      [vendor.id, "vendor", otp, expiresAt]
    );

    // Send OTP to vendor's email
    await sendOTP(vendor.email, otp, "email");

    return res.json({
      status: "otp_sent",
      message: "OTP sent to your email. Please verify to login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// // Verify OTP and Proceed to Password Update (First-time login flow)
// const verifyOTP = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   if (!otp || !email) {
//     return res.status(400).json({ error: "OTP and email are required" });
//   }

//   try {
//     const vendorResult = await pool.query(
//       "SELECT * FROM vendors WHERE email = $1",
//       [email]
//     );
//     const vendor = vendorResult.rows[0];

//     if (!vendor) return res.status(404).json({ error: "Vendor not found" });

//     // Verify the OTP
//     const otpResult = await pool.query(
//       "SELECT * FROM otps WHERE user_id = $1 AND user_type = 'vendor' AND otp = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
//       [vendor.id, otp]
//     );
//     const otpRecord = otpResult.rows[0];

//     if (!otpRecord) {
//       return res.status(400).json({ error: "Invalid or expired OTP" });
//     }

//     await pool.query("DELETE FROM otps WHERE id = $1", [otpRecord.id]); // Remove used OTP

//     // If it's the vendor's first-time login, prompt to update password
//     if (!vendor.password_changed) {
//       if (!newPassword) {
//         return res.status(400).json({ error: "Please provide a new password" });
//       }

//       // Hash the new password and update it in the database
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Update password in the vendors table and set password_changed = true
//       await pool.query(
//         "UPDATE vendors SET password = $1, password_changed = true WHERE id = $2",
//         [hashedPassword, vendor.id]
//       );

//       // Generate JWT Token after password update
//       const sessionId = jwt.sign(
//         { id: vendor.id, email: vendor.email, phone: vendor.phone, name: vendor.name },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       return res.json({
//         status: "password_changed",
//         message: "Password updated successfully. You can now access your dashboard.",
//         session_id: sessionId,
//       });
//     }

//     // If the vendor already has a password and has updated it, allow access to the dashboard
//     const sessionId = jwt.sign(
//       { id: vendor.id, email: vendor.email, phone: vendor.contact_number, name: vendor.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       status: "logged_in",
//       message: "Logged in successfully. You can now access your dashboard.",
//       session_id: sessionId,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// Vendor Logout
// const logout = async (req, res) => {
//   res.json({ status: "success", message: "Logged out successfully" });
// };

// module.exports = { login, verifyOTP, logout};




// Subvendor Login with Email & Password
const subvendorLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const subvendorResult = await pool.query(
      "SELECT * FROM subvendors WHERE email = $1",
      [email]
    );
    const subvendor = subvendorResult.rows[0];

    if (!subvendor) {
      return res.status(404).json({
        status: "not_found",
        message: "Subvendor not found",
        email,
      });
    }

    // Check if subvendor is active
    if (!subvendor.is_active) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    // Validate password
    // const validPassword = await bcrypt.compare(password, subvendor.password);
    // if (!validPassword) {
    //   return res.status(400).json({ error: "Invalid credentials" });
    // }
        // Validate password (plain text comparison)
        if (password !== subvendor.password) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO otps (user_id, user_type, otp, expires_at) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, user_type) 
      DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at
      `,
      [subvendor.id, "subvendor", otp, expiresAt]
    );

    await sendOTP(subvendor.email, otp, "email");

    return res.json({
      status: "otp_sent",
      message: "OTP sent to your email. Please verify to login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Verify OTP and Proceed to Login (Handles both Vendor and Subvendor)
const verifyOTP = async (req, res) => {
  const { email, otp, newPassword, userType } = req.body;

  if (!otp || !email || !userType) {
    return res.status(400).json({ error: "OTP, email, and user type are required" });
  }

  if (!["vendor", "subvendor"].includes(userType)) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  try {
    let user;
    if (userType === "vendor") {
      const vendorResult = await pool.query(
        "SELECT * FROM vendors WHERE email = $1",
        [email]
      );
      user = vendorResult.rows[0];
    } else {
      const subvendorResult = await pool.query(
        "SELECT * FROM subvendors WHERE email = $1",
        [email]
      );
      user = subvendorResult.rows[0];
    }

    if (!user) {
      return res.status(404).json({ error: `${userType} not found` });
    }

    // Verify OTP
    const otpResult = await pool.query(
      "SELECT * FROM otps WHERE user_id = $1 AND user_type = $2 AND otp = $3 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [user.id, userType, otp]
    );
    const otpRecord = otpResult.rows[0];

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await pool.query("DELETE FROM otps WHERE id = $1", [otpRecord.id]); // Remove used OTP

    // For vendors: Handle first-time login password update
    if (userType === "vendor" && !user.password_changed) {
      if (!newPassword) {
        return res.status(400).json({ error: "Please provide a new password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        "UPDATE vendors SET password = $1, password_changed = true WHERE id = $2",
        [hashedPassword, user.id]
      );

      const sessionId = jwt.sign(
        { id: user.id, email: user.email, phone: user.contact_number, name: user.name, userType: "vendor" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        status: "password_changed",
        message: "Password updated successfully. You can now access your dashboard.",
        session_id: sessionId,
      });
    }

    // Generate JWT token for both vendors and subvendors
    const sessionId = jwt.sign(
      { id: user.id, email: user.email, phone: user.contact_number, name: user.name, userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "logged_in",
      message: "Logged in successfully. You can now access your dashboard.",
      session_id: sessionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch Subvendor Permissions
const getSubvendorPermissions = async (req, res) => {
  try {
    const subvendorId = req.user.id; // From JWT middleware
    const userType = req.user.userType;

    if (userType !== "subvendor") {
      return res.status(403).json({ error: "Unauthorized: Not a subvendor" });
    }

    const permissionsResult = await pool.query(
      `
      SELECT p.name, vp.can_view, vp.can_manage 
      FROM vendor_permissions vp 
      JOIN permissions p ON vp.permission_id = p.id 
      WHERE vp.subvendor_id = $1
      `,
      [subvendorId]
    );

    res.json(permissionsResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
// Vendor/Subvendor Logout

// Vendor Logout
// const logout = async (req, res) => {
//   res.json({ status: "success", message: "Logged out successfully" });
// };
const logout = async (req, res) => {
  res.json({ status: "success", message: "Logged out successfully" });
};

module.exports = { login, subvendorLogin, verifyOTP, getSubvendorPermissions, logout };