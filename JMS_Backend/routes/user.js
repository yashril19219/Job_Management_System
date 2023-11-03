
const express = require('express');
const router = express.Router();
const userControl = require("../controllers/user.js");
const auth = require('../middlewares/auth.js');

router.post('/register',userControl.register);
router.post('/login',userControl.login);
router.get('/getUsers',auth(['SuperAdmin','Admin']), userControl.getUsers);

module.exports = router;
