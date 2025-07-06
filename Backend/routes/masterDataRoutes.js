const express = require('express');
const router = express.Router();
const {
  createTraveler,
  getTravelers,
  updateTraveler,
  deleteTraveler,
} = require('../controller/masterDataController');
const { verifyToken } = require('../middleware/vendorAuth');

router.post('/travelers', verifyToken, createTraveler);
router.get('/travelers', verifyToken, getTravelers);
router.put('/travelers/:id', verifyToken, updateTraveler);
router.delete('/travelers/:id', verifyToken, deleteTraveler);

module.exports = router;