const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Etudiant } = require('../models/etudiantmodels');

exports.createEtudiant = async (req, res) => {
    try {
        const { name, lastname, email, password, abonnements, formation } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const etudiant = new Etudiant({
            name,
            lastname,
            email,
            password: hashedPassword,
            abonnements,
            formation
        });

        const savedEtudiant = await etudiant.save();
        res.status(201).send(savedEtudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Example usage of populating references in a response
exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find({})
            .populate('abonnements')
            .populate('formation.cours');
        res.status(200).send(etudiants);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir un étudiant par ID
exports.getEtudiantById = async (req, res) => {
    const id = req.params.id;
    try {
        const etudiant = await Etudiant.findById(id)
            .populate('abonnements')
            .populate('formation.cours');
        if (!etudiant) {
            return res.status(404).send({ message: 'Etudiant not found' });
        }
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};
// Connexion d'un étudiant
exports.loginEtudiant = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required!');
        }

        const etudiant = await Etudiant.findOne({ email });
        if (!etudiant) {
            return res.status(404).send('Email or password invalid!');
        }

        const validPass = await bcrypt.compare(password, etudiant.password);
        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        }

        const payload = {
            _id: etudiant._id,
            email: etudiant.email,
            name: etudiant.name,
            lastname: etudiant.lastname,
        };

        const token = jwt.sign(payload, '123456789', { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Obtenir tous les étudiants
exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find({})
        res.status(200).send(etudiants);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir un étudiant par ID
exports.getEtudiantById = async (req, res) => {
    const id = req.params.id;
    try {
        const etudiant = await Etudiant.findById(id)
            .populate('abonnements')
            .populate('formation.cours');
        if (!etudiant) {
            return res.status(404).send({ message: 'Etudiant not found' });
        }
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};



// Mettre à jour un étudiant
exports.updateEtudiant = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, 10);
        }
        const updatedEtudiant = await Etudiant.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).send(updatedEtudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedEtudiant = await Etudiant.findByIdAndDelete(id);
        if (!deletedEtudiant) {
            return res.status(404).send({ message: 'Etudiant not found' });
        }
        res.status(200).send(deletedEtudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};
