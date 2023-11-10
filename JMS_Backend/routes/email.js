
const express = require('express');
const router = express.Router();
const emailControl = require("../controllers/email.js");


router.post('/produce', emailControl.produce);

module.exports = router;