
// const pool = require('../config/db');

// const createTraveler = async (req, res) => {
//   const { first_name, last_name, prefix, mobile, email, passport_number } = req.body;

//   // Identify the authenticated user/vendor
//   const userId = req.user?.id || null;
//   const vendorId = req.vendor?.id || null;

//   // Check if either is present (but not both)
//   if ((userId && vendorId) || (!userId && !vendorId)) {
//     return res.status(400).json({
//       error: 'Only one of user or vendor must be authenticated',
//     });
//   }

//   if (!first_name || !last_name) {
//     return res.status(400).json({
//       error: 'First name and last name are required',
//     });
//   }

//   try {
//     // Check limit (per user or vendor)
//     const countResult = await pool.query(
//       userId
//         ? 'SELECT COUNT(*) FROM travelers WHERE user_id = $1'
//         : 'SELECT COUNT(*) FROM travelers WHERE vendor_id = $1',
//       [userId || vendorId]
//     );
//     const travelerCount = parseInt(countResult.rows[0].count, 10);

//     if (travelerCount >= 50) {
//       return res.status(400).json({ error: 'Maximum limit of 50 travelers reached' });
//     }

//     const traveler = await pool.query(
//       `INSERT INTO travelers 
//         (${userId ? 'user_id' : 'vendor_id'}, first_name, last_name, prefix, mobile, email, passport_number) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [
//         userId || vendorId,
//         first_name,
//         last_name,
//         prefix || null,
//         mobile || null,
//         email || null,
//         passport_number || null,
//       ]
//     );

//     res.json({
//       status: 'success',
//       message: 'Traveler created successfully',
//       traveler: traveler.rows[0],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// const getTravelers = async (req, res) => {
//   const userId = req.user?.id || null;
//   const vendorId = req.vendor?.id || null;

//   if (!userId && !vendorId) {
//     return res.status(400).json({ error: 'User or Vendor must be authenticated' });
//   }

//   try {
//     const travelers = await pool.query(
//       `SELECT * FROM travelers WHERE ${userId ? 'user_id = $1' : 'vendor_id = $1'}`,
//       [userId || vendorId]
//     );
//     res.json({ status: 'success', travelers: travelers.rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const updateTraveler = async (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, prefix, mobile, email, passport_number } = req.body;
//   const userId = req.user?.id || null;
//   const vendorId = req.vendor?.id || null;

//   try {
//     const existing = await pool.query(
//       `SELECT * FROM travelers WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
//       [id, userId || vendorId]
//     );
//     if (existing.rows.length === 0) {
//       return res.status(404).json({ error: 'Traveler not found' });
//     }

//     const updated = await pool.query(
//       `UPDATE travelers SET 
//         first_name = $1,
//         last_name = $2,
//         prefix = $3,
//         mobile = $4,
//         email = $5,
//         passport_number = $6,
//         updated_at = NOW()
//        WHERE id = $7 AND ${userId ? 'user_id = $8' : 'vendor_id = $8'} RETURNING *`,
//       [
//         first_name || existing.rows[0].first_name,
//         last_name || existing.rows[0].last_name,
//         prefix || existing.rows[0].prefix,
//         mobile || existing.rows[0].mobile,
//         email || existing.rows[0].email,
//         passport_number || existing.rows[0].passport_number,
//         id,
//         userId || vendorId
//       ]
//     );

//     res.json({ status: 'success', message: 'Traveler updated successfully', traveler: updated.rows[0] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const deleteTraveler = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user?.id || null;
//   const vendorId = req.vendor?.id || null;

//   try {
//     const existing = await pool.query(
//       `SELECT * FROM travelers WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
//       [id, userId || vendorId]
//     );
//     if (existing.rows.length === 0) {
//       return res.status(404).json({ error: 'Traveler not found' });
//     }

//     await pool.query(
//       `DELETE FROM travelers WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
//       [id, userId || vendorId]
//     );
//     res.json({ status: 'success', message: 'Traveler deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   createTraveler,
//   getTravelers,
//   updateTraveler,
//   deleteTraveler,
// };


const pool = require('../config/db');

const createTraveler = async (req, res) => {
  const { first_name, last_name, prefix, mobile, email, passport_number } = req.body;

  // Identify the authenticated user/vendor
  const userId = req.user?.id || null;
  const vendorId = req.vendor?.id || null;

  // Check if either is present (but not both)
  if ((userId && vendorId) || (!userId && !vendorId)) {
    return res.status(400).json({
      error: 'Only one of user or vendor must be authenticated',
    });
  }

  if (!first_name || !last_name) {
    return res.status(400).json({
      error: 'First name and last name are required',
    });
  }

  try {
    // Check limit (per user or vendor)
    const countResult = await pool.query(
      userId
        ? 'SELECT COUNT(*) FROM masterdata WHERE user_id = $1'
        : 'SELECT COUNT(*) FROM masterdata WHERE vendor_id = $1',
      [userId || vendorId]
    );
    const travelerCount = parseInt(countResult.rows[0].count, 10);

    if (travelerCount >= 50) {
      return res.status(400).json({ error: 'Maximum limit of 50 travelers reached' });
    }

    const traveler = await pool.query(
      `INSERT INTO masterdata 
        (${userId ? 'user_id' : 'vendor_id'}, first_name, last_name, prefix, mobile, email, passport_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        userId || vendorId,
        first_name,
        last_name,
        prefix || null,
        mobile || null,
        email || null,
        passport_number || null,
      ]
    );

    res.json({
      status: 'success',
      message: 'Traveler created successfully',
      traveler: traveler.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTravelers = async (req, res) => {
  const userId = req.user?.id || null;
  const vendorId = req.vendor?.id || null;

  if (!userId && !vendorId) {
    return res.status(400).json({ error: 'User or Vendor must be authenticated' });
  }

  try {
    const travelers = await pool.query(
      `SELECT * FROM masterdata WHERE ${userId ? 'user_id = $1' : 'vendor_id = $1'}`,
      [userId || vendorId]
    );
    console.log(`Fetched travelers for ${userId ? 'user_id' : 'vendor_id'} ${userId || vendorId}:`, travelers.rows); // Debug log
    res.json({ status: 'success', travelers: travelers.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTraveler = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, prefix, mobile, email, passport_number } = req.body;
  const userId = req.user?.id || null;
  const vendorId = req.vendor?.id || null;

  try {
    const existing = await pool.query(
      `SELECT * FROM masterdata WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
      [id, userId || vendorId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Traveler not found' });
    }

    const updated = await pool.query(
      `UPDATE masterdata SET 
        first_name = $1,
        last_name = $2,
        prefix = $3,
        mobile = $4,
        email = $5,
        passport_number = $6,
        updated_at = NOW()
       WHERE id = $7 AND ${userId ? 'user_id = $8' : 'vendor_id = $8'} RETURNING *`,
      [
        first_name || existing.rows[0].first_name,
        last_name || existing.rows[0].last_name,
        prefix || existing.rows[0].prefix,
        mobile || existing.rows[0].mobile,
        email || existing.rows[0].email,
        passport_number || existing.rows[0].passport_number,
        id,
        userId || vendorId
      ]
    );

    res.json({ status: 'success', message: 'Traveler updated successfully', traveler: updated.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTraveler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const vendorId = req.vendor?.id || null;

  try {
    const existing = await pool.query(
      `SELECT * FROM masterdata WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
      [id, userId || vendorId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Traveler not found' });
    }

    await pool.query(
      `DELETE FROM masterdata WHERE id = $1 AND ${userId ? 'user_id = $2' : 'vendor_id = $2'}`,
      [id, userId || vendorId]
    );
    res.json({ status: 'success', message: 'Traveler deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createTraveler,
  getTravelers,
  updateTraveler,
  deleteTraveler,
};