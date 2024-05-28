const mongoose = require('mongoose');

const abonnementSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    validated: { type: Boolean, default: false }  // Nouveau champ pour la validation
});

const Abonnement = mongoose.model('Abonnement', abonnementSchema);
module.exports = Abonnement;
