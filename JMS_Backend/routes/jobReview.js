const express= require('express');
const router= express.Router();
const {handleGetJobReview,handlePostJobReview,handleUpdateJobReview,handleDeleteJobReview} = require('../controllers/jobReview');

router.route("/")
.get(handleGetJobReview)
.post(handlePostJobReview);

router.route("/:id")
.patch(handleUpdateJobReview)
.delete(handleDeleteJobReview);




module.exports=router;