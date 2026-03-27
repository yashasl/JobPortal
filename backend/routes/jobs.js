const express = require('express');
const router = express.Router();
const { addJob, getJobs, getJobById, deleteJob, applyJob, getUserApplications } = require('../controllers/jobController');
const verifyToken = require('../middleware/auth');

router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/add-job', verifyToken, addJob);
router.delete('/delete-job/:id', verifyToken, deleteJob);
router.post('/apply', verifyToken, applyJob);
router.get('/my-applications', verifyToken, getUserApplications);

module.exports = router;
