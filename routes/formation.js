const express = require('express');
const router = express.Router();
const formationController = require('../controller/formationController');

// Create a new formation
router.post('/', formationController.createFormation);

// Get all formations
router.get('/', formationController.getAllFormation);

// Get a formation by ID
router.get('/:id', formationController.getByIdFormation);

// Update a formation
router.put('/:id', formationController.updateFormation);

// Get formations by createdBy ID
router.get('/createdBy/:createdBy', formationController.getByCreatedByIdFormation);

module.exports = router;
