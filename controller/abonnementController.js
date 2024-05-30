const express = require('express');
const router = express.Router();
const Abonnement = require('../models/abonnement');
const Formation = require('../models/formationmodels');
const Student = require('../models/studentmodels');

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
      validated: true,
      duration: 'annuel' // Assuming global abonnements are annual
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
    const { student, formation, startDate, endDate, validated, firstName, lastName, duration } = req.body;
    const abonnement = await Abonnement.findByIdAndUpdate(
      req.params.id,
      { student, formation, startDate, endDate, validated, firstName, lastName, duration },
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

exports.createAbonnement = async (req, res) => {
  try {
    const { student, startDate, endDate, validated, firstName, lastName, duration } = req.body;

    const existingStudent = await Student.findById(student);
    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const abonnement = new Abonnement({
      student,
      startDate,
      endDate,
      validated,
      firstName,
      lastName,
      duration
    });

    await abonnement.save();

    // Update the student document with the new abonnement ID
    existingStudent.abonnements.push(abonnement._id);
    await existingStudent.save();

    res.status(201).json(abonnement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get Abonnements by Student
exports.getAbonnementsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const abonnements = await Abonnement.find({ student: studentId });
    res.json(abonnements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check Subscription
exports.checkSubscription = async (req, res) => {
  try {
    const { studentId } = req.params;

    const abonnement = await Abonnement.findOne({
      student: studentId,
    });

    if (!abonnement) {
      return res.json({ status: 'no_subscription' });
    }

    const currentDate = new Date();
    if (abonnement.endDate < currentDate) {
      return res.json({ status: 'expired' });
    }

    res.json({ status: 'valid' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

