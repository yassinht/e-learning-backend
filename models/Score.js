const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    dateTaken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
