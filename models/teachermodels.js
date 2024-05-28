const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    specialization: { type: String },
  });

  const Teacher = mongoose.model('Teacher', teacherSchema);
  module.exports = Teacher ;
