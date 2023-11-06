const express= require('express');
const router= express.Router();
const {handleGetJob,handlePostJob,handleUpdateJob,handleDeleteJob} = require('../controllers/job');
const auth = require('../middlewares/auth.js');


router.route("/")
.get(auth(['User','SuperAdmin','Admin','Moderator','Manager']),handleGetJob)
.post(auth(['SuperAdmin','Admin','Moderator','Manager']),handlePostJob);

router.route('/:id')
.patch(auth(['User','SuperAdmin','Admin','Moderator','Manager']),handleUpdateJob)
.delete(auth(['SuperAdmin','Admin','Moderator','Manager']),handleDeleteJob);


module.exports=router;