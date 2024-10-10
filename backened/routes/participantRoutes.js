const express = require('express');
const router = express.Router();
const { saveParticipant } = require('../controllers/participantController.js');

router.post('/saveParticipant', saveParticipant);

module.exports = router;
