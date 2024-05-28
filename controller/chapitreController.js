// Importation du modèle Chapitre
const Chapitre = require('../models/chapitremodels');

// Contrôleur pour gérer les opérations sur les chapitres

// Fonction pour récupérer tous les chapitres
exports.getAllChapitres = async (req, res) => {
    try {
        const chapitres = await Chapitre.find();
        res.status(200).json(chapitres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fonction pour récupérer un chapitre par son ID
exports.getChapitreById = async (req, res) => {
    try {
        const chapitre = await Chapitre.findById(req.params.id);
        if (chapitre) {
            res.status(200).json(chapitre);
        } else {
            res.status(404).json({ message: "Chapitre non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fonction pour créer un nouveau chapitre
exports.createChapitre = async (req, res) => {
    const chapitre = new Chapitre({
        titre: req.body.titre,
        contenu: req.body.contenu
    });
    try {
        const newChapitre = await chapitre.save();
        res.status(201).json(newChapitre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fonction pour mettre à jour un chapitre existant
exports.updateChapitre = async (req, res) => {
    try {
        const chapitre = await Chapitre.findById(req.params.id);
        if (chapitre) {
            chapitre.titre = req.body.titre || chapitre.titre;
            chapitre.contenu = req.body.contenu || chapitre.contenu;
            const updatedChapitre = await chapitre.save();
            res.json(updatedChapitre);
        } else {
            res.status(404).json({ message: "Chapitre non trouvé" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fonction pour supprimer un chapitre
exports.deleteChapitre = async (req, res) => {
    try {
        const chapitre = await Chapitre.findById(req.params.id);
        if (chapitre) {
            await chapitre.remove();
            res.json({ message: "Chapitre supprimé" });
        } else {
            res.status(404).json({ message: "Chapitre non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
