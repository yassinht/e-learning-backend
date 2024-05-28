const mongoose = require('mongoose');

const chapitreSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  });

  const Chapitre = mongoose.model('Chapitre', chapitreSchema);

  module.exports = { Chapitre };
