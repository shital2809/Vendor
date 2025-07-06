const express = require('express');
const router = express.Router();

const { getpermissions , getsubvendors, subvendors, update, deleted, assign, permissions} = require('../controller/vendorController');
const { verifyToken } = require('../middleware/authmiddleware');


router.get('/permissions', verifyToken, getpermissions);
router.get('/subvendors', verifyToken, getsubvendors);
router.post('/subvendors', verifyToken, subvendors);
router.put('/subvendors/:id', verifyToken, update);
router.delete('/subvendors/:id', verifyToken, deleted);
router.post('/permissions/assign', verifyToken, assign);        
router.get('/subvendors/:id/permissions', verifyToken, permissions);

module.exports = router;