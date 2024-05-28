
const mongoose = require('mongoose');

const coursSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  });

  const Cours = mongoose.model('Cours', coursSchema);
  module.exports = Cours 