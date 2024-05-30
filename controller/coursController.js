// controller/cours.js
const Cours = require('../models/coursmodels');

// Créer une nouvelle cours
exports.createCours = async (req, res) => {
    try {
        const { name, description } = req.body;
        const cours = new Cours({ name, description });
        await cours.save();
        res.status(201).json(cours);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir toutes les cours
exports.getAllCours = async (req, res) => {
    try {
        const cours = await Cours.find();
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir une cours par ID
exports.getCoursById = async (req, res) => {
    try {
        const cours = await Cours.findById(req.params.id);
        if (!cours) {
            return res.status(404).json({ error: 'Cours not found' });
        }
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateCours = async (req, res) => {
    try {
        const { name, description } = req.body;
        const coursy = await Cours.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!cours) {
            return res.status(404).json({ error: 'Cours not found' });
        }
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une cours
exports.deleteCours = async (req, res) => {
    try {
        const cours = await Cours.findByIdAndDelete(req.params.id);
        if (!cours) {
            return res.status(404).json({ error: 'Cours not found' });
        }
        res.json({ message: 'Cours deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get a course by ID
exports.getMyCoursById = async (req, res) => {
    try {
        const idTeacher = req.params.id; // Assuming idTeacher is passed as a parameter
        const cours = await Cours.find({ teacher: idTeacher }).populate('formation teacher');
        
        if (!cours || cours.length === 0) {
            return res.status(404).json({ error: 'No courses found for this teacher' });
        }
        
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all courses by formation ID
exports.getAllCoursesByFormation = async (req, res) => {
    const idFormation = req.params.idFormation;

    try {
        const courses = await Cours.find({ formation: idFormation })
            .populate('teacher') // Populate teacher details if needed
            .exec();

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};