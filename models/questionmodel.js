const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    options: [{
        content: { type: String, required: true },
        isCorrect: { type: Boolean, default: false } // Indique si cette option est la bonne réponse
    }]
});

const Question = mongoose.model('Question', questionSchema);

module.exports =  Question ;
