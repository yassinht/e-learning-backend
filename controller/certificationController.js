const Certification = require('../models/certification');
const Student = require('../models/studentmodels');
const Formation = require('../models/formationmodels');
const Course = require('../models/coursmodels');
const Quiz = require('../models/quizmodels');

exports.getCertif = async (studentId, formationId) => {
    try {
        // Check if all courses in the formation are completed
        const allCoursesCompleted = await areAllCoursesCompleted(studentId, formationId);
        if (!allCoursesCompleted) {
            throw new Error('All courses in the formation are not completed');
        }

        // Check if all quizzes in the formation are submitted
        const allQuizzesSubmitted = await areAllQuizzesSubmitted(studentId, formationId);
        if (!allQuizzesSubmitted) {
            throw new Error('All quizzes in the formation are not submitted');
        }

        // If all conditions are met, issue certification
        const certification = new Certification({
            student: studentId,
            formation: formationId,
            dateIssued: Date.now(),
            // Assuming you have a way to determine who certifies (e.g., a default teacher or logged-in user)
            certifiedBy: 'default_teacher_id'
        });

        await certification.save();
        return certification;
    } catch (error) {
        console.error('Error issuing certification:', error.message);
        throw error;
    }
};

async function areAllCoursesCompleted(studentId, formationId) {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error('Student not found');
    }

    const formation = student.formation.find(f => f.formationId.equals(formationId));
    if (!formation) {
        throw new Error('Formation not found for the student');
    }

    return formation.cours.every(course => course.completed);
}

async function areAllQuizzesSubmitted(studentId, formationId) {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error('Student not found');
    }

    const formation = student.formation.find(f => f.formationId.equals(formationId));
    if (!formation) {
        throw new Error('Formation not found for the student');
    }

    // Assuming you have a Quiz model and a way to check quiz submission status
    const quizzes = await Quiz.find({ student: studentId, formation: formationId });
    return quizzes.every(quiz => quiz.submitted);
}
