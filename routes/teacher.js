
const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teacherController');
const upload = require('../middleware/multerConfig');

// Teacher registration with file upload
router.post('/', upload.single('image'), teacherController.createTeacher);

router.post('/login', teacherController.loginTeacher);

router.get('/', teacherController.getAllTeachers);

router.get('/:id', teacherController.getTeacherById);

router.put('/:id', upload.single('image'), teacherController.updateTeacher);

router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;