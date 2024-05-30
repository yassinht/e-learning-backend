const express = require('express');
const router = express.Router();
const etudiantController = require('../controller/etudiantController');
const certificationController = require('../controller/certificationController');

const upload = require('../middleware/multerConfig');
// Student registration with file upload
router.post('/', upload.single('image'), etudiantController.createStudent);

router.post('/login', etudiantController.loginEtudiant);

router.get('/', etudiantController.getAllEtudiants);

router.get('/:id', etudiantController.getEtudiantById);

router.put('/:id', upload.single('image'), etudiantController.updateEtudiant);

router.delete('/:id', etudiantController.deleteEtudiant);

router.get('/progress/:studentId/formations/:formationId', etudiantController.getProgress);

// router.put('/:studentId/formations/:formationId/courses/:courseId/progress', etudiantController.updateProgress);


// Route to update progress of a course within a formation for a student
router.put('/progress/:studentId/formations/:formationId/courses/:courseId', etudiantController.updateCourseProgress);


router.get('/progressformation/:studentId/formations/:formationId/', etudiantController.getFormationProgress);


module.exports = router;
