const express= require('express');
const router= express.Router();
const {handleGetJob,handlePostJob,handleUpdateJob} = require('../controllers/job');

router.route("/")
.get(handleGetJob)
.post(handlePostJob);

router.route('/:id')
.patch(handleUpdateJob)


module.exports=router;