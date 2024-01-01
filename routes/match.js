const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

// Get all matches
router.get('/getMatches', matchController.getAllMatches);
router.put('/getResults',matchController.getResults)
module.exports = router;
