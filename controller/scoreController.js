const Score = require('../models/Score');

exports.submitQuiz = async (req, res) => {
    try {
        const { studentId, quizId, score } = req.body;
        const newScore = new Score({
            student: studentId,
            quiz: quizId,
            score
        });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getScoresByStudent = async (req, res) => {
    try {
        const scores = await Score.find({ student: req.params.studentId });
        res.status(200).json(scores);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
