const express = require('express');
const router = express.Router();
const chapitreController = require('../controller/chapitreController');

// Routes pour les chapitres

router.get('/', chapitreController.getAllChapitres);

router.get('/:id', chapitreController.getChapitreById);

router.post('/', chapitreController.createChapitre);

router.put('/:id', chapitreController.updateChapitre);

router.delete('/:id', chapitreController.deleteChapitre);

module.exports = router;
