
const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teacherController');

router.post('/', teacherController.createTeacher);

router.post('/login', teacherController.loginTeacher);

router.get('/', teacherController.getAllTeachers);

router.get('/:id', teacherController.getTeacherById);

router.put('/:id', teacherController.updateTeacher);

router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
