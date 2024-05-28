const Abonnement = require('../models/abonnement');
const Formation = require('../models/formationmodels');
const Etudiant = require('../models/etudiantmodels');
// Create Abonnement (pending validation)
exports.createAbonnement = async (req, res) => {
    try {
        const { student, formation, startDate, endDate } = req.body;
        const existingStudent = await Student.findById(student);
        const existingFormation = await Formation.findById(formation);
        if (!existingStudent || !existingFormation) {
            return res.status(404).json({ error: 'Student or Formation not found' });
        }
        const abonnement = new Abonnement({ student, formation, startDate, endDate, validated: false });
        await abonnement.save();
        res.status(201).json(abonnement);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Validate Abonnement
exports.validateAbonnement = async (req, res) => {
    try {
        const abonnement = await Abonnement.findById(req.params.id);
        if (!abonnement) {
            return res.status(404).json({ error: 'Abonnement not found' });
        }
        abonnement.validated = true;
        await abonnement.save();
        res.json(abonnement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create Global Abonnement
exports.createGlobalAbonnement = async (req, res) => {
    try {
        const { student, startDate, endDate } = req.body;
        const existingStudent = await Student.findById(student);
        if (!existingStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const formations = await Formation.find();
        const abonnements = formations.map(formation => ({
            student,
            formation: formation._id,
            startDate,
            endDate,
            validated: true
        }));
        await Abonnement.insertMany(abonnements);
        res.status(201).json({ message: 'Global abonnement created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Abonnements
exports.getAllAbonnements = async (req, res) => {
    try {
        const abonnements = await Abonnement.find().populate('student').populate('formation');
        res.json(abonnements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Abonnement by ID
exports.getAbonnementById = async (req, res) => {
    try {
        const abonnement = await Abonnement.findById(req.params.id).populate('student').populate('formation');
        if (!abonnement) {
            return res.status(404).json({ error: 'Abonnement not found' });
        }
        res.json(abonnement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Abonnement
exports.updateAbonnement = async (req, res) => {
    try {
        const { student, formation, startDate, endDate, validated } = req.body;
        const abonnement = await Abonnement.findByIdAndUpdate(
            req.params.id,
            { student, formation, startDate, endDate, validated },
            { new: true }
        );
        if (!abonnement) {
            return res.status(404).json({ error: 'Abonnement not found' });
        }
        res.json(abonnement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Abonnement
exports.deleteAbonnement = async (req, res) => {
    try {
        const abonnement = await Abonnement.findByIdAndDelete(req.params.id);
        if (!abonnement) {
            return res.status(404).json({ error: 'Abonnement not found' });
        }
        res.json({ message: 'Abonnement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkSubscription = async (req, res) => {
    try {
        const { studentId, formationId } = req.body;
        const abonnement = await Abonnement.findOne({
            student: studentId,
            formation: formationId,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            validated: true
        });
        if (abonnement) {
            res.json({ isValid: true });
        } else {
            res.json({ isValid: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};