// routes/category.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Routes pour les catégories

// Créer une nouvelle catégorie
router.post('/', categoryController.createCategory);

// Récupérer toutes les catégories
router.get('/', categoryController.getAllCategories);

// Récupérer une catégorie par son ID
router.get('/:id', categoryController.getCategoryById);

// Mettre à jour une catégorie
router.put('/:id', categoryController.updateCategory);

// Supprimer une catégorie
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
