const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, getAllApplications, updateApplicationStatus } = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/applications', verifyToken, getAllApplications);
router.put('/applications/:id/status', verifyToken, updateApplicationStatus);

module.exports = router;
