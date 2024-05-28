const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    abonnements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Abonnement' }], // Reference to Abonnement model
    formation: [{
        cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours' },
        progress: { type: Number, default: 0 }
    }]
});

const Etudiant = mongoose.model('Etudiant', etudiantSchema);

module.exports = { Etudiant };
