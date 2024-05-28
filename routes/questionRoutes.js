const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// POST /api/questions
router.post('/', questionController.createQuestion);

// GET /api/questions
router.get('/', questionController.getAllQuestions);

// GET /api/questions/:questionId
router.get('/:questionId', questionController.getQuestionById);

// PUT /api/questions/:questionId
router.put('/:questionId', questionController.updateQuestion);

// DELETE /api/questions/:questionId
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;
