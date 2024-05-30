const express = require('express');
const router = express.Router();
const abonnementController = require('../controller/abonnementController');

router.get('/', abonnementController.getAllAbonnements);
router.get('/:id', abonnementController.getAbonnementById);
router.put('/:id', abonnementController.updateAbonnement);
router.delete('/:id', abonnementController.deleteAbonnement);
router.get('/check-subscription/:studentId', abonnementController.checkSubscription);
router.get('/student/:studentId', abonnementController.getAbonnementsByStudent);
router.post('/', abonnementController.createAbonnement);

module.exports = router;
