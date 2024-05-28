const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    formations: [{ type: Schema.Types.ObjectId, ref: 'Formation' }], // Reference to Formation model
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Reference to Question model
    createdBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true } // Reference to Teacher who created the quiz
});

module.exports = mongoose.model('Quiz', quizSchema);
