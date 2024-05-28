const express = require('express');
const router = express.Router();
const quizController = require('../controller/quizController');

// Existing routes...
router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);
router.post('/:quizId/questions', quizController.addQuestionToQuiz);

// New routes
router.get('/:quizId/questions', quizController.getQuestionsByQuizId);
router.get('/teacher/:teacherId/quizzes', quizController.getQuizzesByTeacherId);
router.get('/student/:studentId/formations/:formationId/quizzes', quizController.getQuizzesForFormation);
router.post('/student/:studentId/quizzes/:quizId/submit', quizController.submitQuiz);

module.exports = router;
