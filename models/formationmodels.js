// models/Formation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formationschema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  image: { type: String },
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Added category field
});

const Formation = mongoose.model('Formation', formationschema);

module.exports = Formation;
