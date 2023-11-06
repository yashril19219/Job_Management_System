const express = require('express');
const router = express.Router();
const jobRequestControl = require("../controllers/jobRequest.js");
const auth = require('../middlewares/auth.js');

router.post('/apply/:id', auth(['User']), jobRequestControl.apply); //apply for the job
router.get('/jobRequest', auth(['SuperAdmin', 'Moderator','Admin','Manager']),jobRequestControl.getJobRequests); // get all the job requests
router.patch('/jobRequest/:id', auth(['SuperAdmin', 'Moderator']), jobRequestControl.takeAction); //reject or approve
module.exports = router;