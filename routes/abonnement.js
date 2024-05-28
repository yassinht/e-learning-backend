const express = require('express');
const router = express.Router();
const abonnementController = require('../controller/abonnementController');

router.post('/abonnements', abonnementController.createAbonnement);
router.get('/abonnements', abonnementController.getAllAbonnements);
router.get('/abonnements/:id', abonnementController.getAbonnementById);
router.put('/abonnements/:id', abonnementController.updateAbonnement);
router.delete('/abonnements/:id', abonnementController.deleteAbonnement);
router.post('/abonnements/check', abonnementController.checkSubscription);

module.exports = router;
