
const express = require('express');
const router = express.Router();
const userControl = require("../controllers/user.js");
const auth = require('../middlewares/auth.js');


router.post('/register',userControl.register);
router.post('/login',userControl.login);
router.get('/users',auth(['SuperAdmin','Admin']), userControl.getUsers);
router.get('/user/:id',auth(['SuperAdmin','Admin']), userControl.getUser);
router.patch('/user/changeRole/:id',auth(['SuperAdmin']),userControl.changeRole);

module.exports = router;
