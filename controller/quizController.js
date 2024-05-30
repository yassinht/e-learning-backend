const Quiz = require('../models/quizModel');
const Certification = require('../models/Certification');

exports.createQuiz = async (req, res) => {
    try {
        const { title, description, formations } = req.body;

        const quiz = new Quiz({
            title,
            description,
            formations
        });

        await quiz.save();

        res.status(201).json({ quiz });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions'); // Assuming 'questions' is the field referencing Question model
        res.json({ quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId).populate('questions'); // Assuming 'questions' is the field referencing Question model
        
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({ quiz });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { title, description, formations } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            { title, description, formations },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({ quiz });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        const quiz = await Quiz.findByIdAndDelete(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Add a question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { content, options } = req.body;

        // Create a new question
        const newQuestion = new Question({ content, options });
        const savedQuestion = await newQuestion.save();

        // Add the question to the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { $push: { questions: savedQuestion._id } },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(201).json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get questions assigned to a specific quiz
exports.getQuestionsByQuizId = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz.questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get quizzes created by a specific teacher
exports.getQuizzesByTeacherId = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ createdBy: req.params.teacherId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get quizzes for a specific formation (for students)
exports.getQuizzesForFormation = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ formations: req.params.formationId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit a quiz (for students)
exports.submitQuiz = async (req, res) => {
    try {
        const { studentId, quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId).populate('questions');
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.options.find(option => option._id.equals(answers[index]) && option.isCorrect)) {
                score += 1;
            }
        });
        const newScore = new Score({
            student: studentId,
            quiz: quizId,
            score
        });
        await newScore.save();
        
        // Check if score is above passing mark (assume a passing score is provided in quiz)
        if (score >= quiz.passingScore) {
            const certification = new Certification({
                student: studentId,
                formation: quiz.formations[0], // Assuming one formation per quiz
                certifiedBy: quiz.createdBy
            });
            await certification.save();
        }
        
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};