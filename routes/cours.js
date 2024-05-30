const express = require('express');
const router = express.Router();
const coursController = require('../controller/coursController');

// Routes pour les cours

router.get('/', coursController.getAllCours);

router.get('/:id', coursController.getCoursById);

router.post('/', coursController.createCours);

router.put('/:id', coursController.updateCours);

router.delete('/:id', coursController.deleteCours);

router.get('/myCoures/:id', coursController.getMyCoursById);

// GET all courses by formation ID
router.get('/formation/:idFormation', coursController.getAllCoursesByFormation);

module.exports = router;
