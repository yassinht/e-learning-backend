const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours' },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const formationSchema = new mongoose.Schema({
  formationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
  cours: [courseSchema]
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  abonnements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Abonnement' }],
  formation: [formationSchema],
  image: { type: String }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
