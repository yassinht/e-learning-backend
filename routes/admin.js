const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.post('/', adminController.createAdmin);

router.post('/login', adminController.loginAdmin);

router.get('/', adminController.getAllAdmins);

router.get('/:id', adminController.getAdminById);

router.put('/:id', adminController.updateAdmin);

router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
