
const express = require('express');
const router = express.Router();
const etudiantController = require('../controller/etudiantController');

router.post('/', etudiantController.createEtudiant);

router.post('/login', etudiantController.loginEtudiant);

router.get('/', etudiantController.getAllEtudiants);

router.get('/:id', etudiantController.getEtudiantById);

router.put('/:id',etudiantController.updateEtudiant);

router.delete('/:id',etudiantController.deleteEtudiant);

module.exports = router;
