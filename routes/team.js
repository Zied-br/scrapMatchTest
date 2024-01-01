const express = require('express');
const teamController = require('../controllers/teamController');


const router = express.Router();
router.post('/addTeams', teamController.addTeams);


module.exports = router;
