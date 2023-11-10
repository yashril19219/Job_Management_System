const express= require('express');
const router= express.Router();
const {handleGetJobReview,handlePostJobReview,handleUpdateJobReview,handleDeleteJobReview} = require('../controllers/jobReview');
const auth = require('../middlewares/auth.js');

router.route("/")
.get(auth(['SuperAdmin','Admin','Moderator','Manager']),handleGetJobReview)
.post(auth(['SuperAdmin','Admin','Moderator','Manager']),handlePostJobReview);

router.route("/:id")
.patch(auth(['SuperAdmin','Manager']),handleUpdateJobReview)
.delete(auth(['SuperAdmin','Manager','Moderator']),handleDeleteJobReview);




module.exports=router;