const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.post('/', scoreController.submitQuiz);
router.get('/student/:studentId', scoreController.getScoresByStudent);

module.exports = router;
