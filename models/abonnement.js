const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AbonnementSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  formation: { type: Schema.Types.ObjectId, ref: 'Formation', required: true },
    duration: {
    type: String,
    required: true,
    enum: ['1 mois', '3 mois', 'annuel'],
    default: '1 mois'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  validated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Abonnement', AbonnementSchema);
