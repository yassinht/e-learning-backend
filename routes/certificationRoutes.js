const express = require('express');
const router = express.Router();
const certificationController = require('../controller/certificationController');

// POST route to issue certification
router.post('/certifications/:studentId/:formationId', async (req, res) => {
    const { studentId, formationId } = req.params;

    try {
        const certification = await certificationController.getCertif(studentId, formationId);
        res.status(200).json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
