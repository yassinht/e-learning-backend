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


router.get('/:id', formationController.getFormationDetails);


// Route to start a formation for a student
router.post('/student/:studentId/formations/:formationId/start', formationController.startFormation);

// Route to get unstarted formations for a student
router.get('/student/:studentId/unstartedFormations', formationController.getUnstartedFormations);

module.exports = router;
