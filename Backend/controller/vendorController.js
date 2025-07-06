const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");   

pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected successfully');
    }
  });
  
// // Get all permissions
// const getpermissions = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM permissions');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching permissions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Get all subvendors for the logged-in vendor
// const getsubvendors = async (req, res) => {
//     try {
//         const result = await pool.query(
//             'SELECT * FROM subvendors WHERE vendor_id = $1',
//             [req.vendor.id]
//         );
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching subvendors:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Create a new subvendor
// const subvendors = async (req, res) => {
//     try {
//         const { name, email, password, contact_number } = req.body;
//         const vendor_id = req.vendor.id;

//         if (!name || !email || !password || !contact_number) {
//             return res.status(400).json({ error: 'All fields are required except vendor_id' });
//         }

//         const result = await pool.query(
//             'INSERT INTO subvendors (vendor_id, name, email, password, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [vendor_id, name, email, password, contact_number]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error creating subvendor:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Update a subvendor
// const update = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email, password, contact_number } = req.body;

//         // Verify that the subvendor belongs to the logged-in vendor
//         const subvendorResult = await pool.query(
//             'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
//             [id, req.vendor.id]
//         );
//         if (subvendorResult.rows.length === 0) {
//             return res.status(403).json({ error: 'You are not authorized to update this subvendor' });
//         }

//         const updates = [];
//         const values = [];
//         let paramIndex = 1;

//         if (name) {
//             updates.push(`name = $${paramIndex++}`);
//             values.push(name);
//         }
//         if (email) {
//             updates.push(`email = $${paramIndex++}`);
//             values.push(email);
//         }
//         if (password) {
//             updates.push(`password = $${paramIndex++}`);
//             values.push(password);
//         }
//         if (contact_number) {
//             updates.push(`contact_number = $${paramIndex++}`);
//             values.push(contact_number);
//         }

//         if (updates.length === 0) {
//             return res.status(400).json({ error: 'No fields to update' });
//         }

//         values.push(id);
//         const query = `UPDATE subvendors SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
//         const result = await pool.query(query, values);

//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error('Error updating subvendor:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Delete a subvendor
// const deleted = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Verify that the subvendor belongs to the logged-in vendor
//         const subvendorResult = await pool.query(
//             'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
//             [id, req.vendor.id]
//         );
//         if (subvendorResult.rows.length === 0) {
//             return res.status(403).json({ error: 'You are not authorized to delete this subvendor' });
//         }

//         // Delete associated permissions first (if any)
//         await pool.query('DELETE FROM vendor_permissions WHERE subvendor_id = $1', [id]);

//         // Delete the subvendor
//         await pool.query('DELETE FROM subvendors WHERE id = $1', [id]);

//         res.json({ message: 'Subvendor deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting subvendor:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Assign or update permissions for a subvendor
// const assign = async (req, res) => {
//     try {
//         const { subvendor_id, permissions } = req.body;

//         if (!subvendor_id || !Array.isArray(permissions) || permissions.length === 0) {
//             return res.status(400).json({ error: 'Invalid input: subvendor_id and array of permissions are required' });
//         }

//         const subvendorResult = await pool.query(
//             'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
//             [subvendor_id, req.vendor.id]
//         );
//         if (subvendorResult.rows.length === 0) {
//             return res.status(403).json({ error: 'You are not authorized to assign permissions to this subvendor' });
//         }

//         const client = await pool.connect();
//         try {
//             await client.query('BEGIN');

//             const queries = permissions.map(({ permission_id, can_view, can_manage }) => {
//                 if (!permission_id || typeof can_view !== 'boolean' || typeof can_manage !== 'boolean') {
//                     throw new Error('Invalid permission data');
//                 }
//                 return client.query(
//                     'INSERT INTO vendor_permissions (subvendor_id, permission_id, can_view, can_manage) VALUES ($1, $2, $3, $4) ON CONFLICT (subvendor_id, permission_id) DO UPDATE SET can_view = $3, can_manage = $4 RETURNING *',
//                     [subvendor_id, permission_id, can_view, can_manage]
//                 );
//             });

//             const results = await Promise.all(queries);
//             await client.query('COMMIT');
//             res.status(201).json(results.map(result => result.rows[0]));
//         } catch (error) {
//             await client.query('ROLLBACK');
//             console.error('Error assigning permissions:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         } finally {
//             client.release();
//         }
//     } catch (error) {
//         console.error('Error assigning permissions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Get permissions for a subvendor
// const permissions = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const subvendorResult = await pool.query(
//             'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
//             [id, req.vendor.id]
//         );
//         if (subvendorResult.rows.length === 0) {
//             return res.status(403).json({ error: 'You are not authorized to view permissions for this subvendor' });
//         }

//         const result = await pool.query(
//             'SELECT p.*, vp.can_view, vp.can_manage FROM vendor_permissions vp JOIN permissions p ON vp.permission_id = p.id WHERE vp.subvendor_id = $1',
//             [id]
//         );
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching permissions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
// module.exports = { getpermissions , getsubvendors, subvendors, update, deleted, assign, permissions };



// Get all permissions
const getpermissions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM permissions');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all subvendors for the logged-in vendor
const getsubvendors = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const result = await pool.query(
            'SELECT * FROM subvendors WHERE vendor_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching subvendors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new subvendor
const subvendors = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const { name, email, password, contact_number } = req.body;
        const vendor_id = req.user.id;

        if (!name || !email || !password || !contact_number) {
            return res.status(400).json({ error: 'All fields are required except vendor_id' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check for duplicate email
        const existingSubvendor = await pool.query(
            'SELECT * FROM subvendors WHERE email = $1',
            [email]
        );
        if (existingSubvendor.rows.length > 0) {
            return res.status(400).json({ error: 'Subvendor with this email already exists' });
        }

        const result = await pool.query(
            'INSERT INTO subvendors (vendor_id, name, email, password, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [vendor_id, name, email, password, contact_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating subvendor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a subvendor
const update = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const { id } = req.params;
        const { name, email, password, contact_number } = req.body;

        // Verify that the subvendor belongs to the logged-in vendor
        const subvendorResult = await pool.query(
            'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
            [id, req.user.id]
        );
        if (subvendorResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to update this subvendor' });
        }

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (name) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }
        if (password) {
            updates.push(`password = $${paramIndex++}`);
            values.push(password);
        }
        if (contact_number) {
            updates.push(`contact_number = $${paramIndex++}`);
            values.push(contact_number);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const query = `UPDATE subvendors SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating subvendor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a subvendor
const deleted = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const { id } = req.params;

        // Verify that the subvendor belongs to the logged-in vendor
        const subvendorResult = await pool.query(
            'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
            [id, req.user.id]
        );
        if (subvendorResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this subvendor' });
        }

        // Delete associated permissions first (if any)
        await pool.query('DELETE FROM vendor_permissions WHERE subvendor_id = $1', [id]);

        // Delete the subvendor
        await pool.query('DELETE FROM subvendors WHERE id = $1', [id]);

        res.json({ message: 'Subvendor deleted successfully' });
    } catch (error) {
        console.error('Error deleting subvendor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Assign or update permissions for a subvendor
const assign = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const { subvendor_id, permissions } = req.body;

        if (!subvendor_id || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ error: 'Invalid input: subvendor_id and array of permissions are required' });
        }

        const subvendorResult = await pool.query(
            'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
            [subvendor_id, req.user.id]
        );
        if (subvendorResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to assign permissions to this subvendor' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const queries = permissions.map(({ permission_id, can_view, can_manage }) => {
                if (!permission_id || typeof can_view !== 'boolean' || typeof can_manage !== 'boolean') {
                    throw new Error('Invalid permission data');
                }
                return client.query(
                    'INSERT INTO vendor_permissions (subvendor_id, permission_id, can_view, can_manage) VALUES ($1, $2, $3, $4) ON CONFLICT (subvendor_id, permission_id) DO UPDATE SET can_view = $3, can_manage = $4 RETURNING *',
                    [subvendor_id, permission_id, can_view, can_manage]
                );
            });

            const results = await Promise.all(queries);
            await client.query('COMMIT');
            res.status(201).json(results.map(result => result.rows[0]));
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error assigning permissions:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error assigning permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get permissions for a subvendor
const permissions = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const { id } = req.params;

        const subvendorResult = await pool.query(
            'SELECT * FROM subvendors WHERE id = $1 AND vendor_id = $2',
            [id, req.user.id]
        );
        if (subvendorResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to view permissions for this subvendor' });
        }

        const result = await pool.query(
            'SELECT p.*, vp.can_view, vp.can_manage FROM vendor_permissions vp JOIN permissions p ON vp.permission_id = p.id WHERE vp.subvendor_id = $1',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getpermissions, getsubvendors, subvendors, update, deleted, assign, permissions };