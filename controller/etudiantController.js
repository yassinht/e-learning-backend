const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentmodels');
const Course = require('../models/coursmodels');

exports.createStudent = async (req, res) => {
    try {
        const { name, lastname, email, password, abonnements, formation, image } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            name,
            lastname,
            email,
            password: hashedPassword,
            abonnements: abonnements || [], // Default to empty array if not provided
            formation: formation || [], // Default to empty array if not provided
            image: image || null // Default to null if not provided
        });

        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Connexion d'un étudiant
exports.loginEtudiant = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required!');
        }

        const etudiant = await Student.findOne({ email });
        if (!etudiant) {
            return res.status(404).send('Email or password invalid!');
        }

        const validPass = await bcrypt.compare(password, etudiant.password);
        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        }

        const payload = {
            _id: etudiant._id,
            email: etudiant.email,
            name: etudiant.name,
            lastname: etudiant.lastname,
        };

        const token = jwt.sign(payload, '123456789', { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
// Obtenir tous les étudiants
exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Student.find({})
            .populate('abonnements')
            .populate('formation.formationId')
            .populate('formation.cours.courseId');
        res.status(200).send(etudiants);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir un étudiant par ID
exports.getEtudiantById = async (req, res) => {
    const id = req.params.id;
    try {
        const etudiant = await Student.findById(id)
            .populate('abonnements')
            .populate('formation.formationId')
            .populate('formation.cours.courseId');
        if (!etudiant) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateEtudiant = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, 10);
        }

        if (req.file) {
            newData.image = req.file.filename; // Update the image field if a new image is uploaded
        }

        const updatedEtudiant = await Student.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).send(updatedEtudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedEtudiant = await Student.findByIdAndDelete(id);
        if (!deletedEtudiant) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.status(200).send(deletedEtudiant);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get progress for a student in a formation
exports.getProgress = async (req, res) => {
    try {
        const { studentId, formationId } = req.params;
        const student = await Student.findById(studentId).populate('formation.formationId formation.cours.courseId');
        const formation = student.formation.find(f => f.formationId.equals(formationId));

        if (!formation) {
            return res.status(404).json({ error: 'Formation not found' });
        }

        res.status(200).json(formation.cours);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCourseProgress = async (req, res) => {
    try {
        const { studentId, formationId, courseId } = req.params;
        const { completed = true, progress = 100 } = req.body; // Default values to mark as completed and full progress

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const formation = student.formation.find(f => f.formationId.equals(formationId));
        if (!formation) {
            return res.status(404).json({ error: 'Formation not found' });
        }

        let course = formation.cours.find(c => c.courseId.equals(courseId));
        if (!course) {
            // If the course does not exist, add it
            course = {
                courseId: new mongoose.Types.ObjectId(courseId), // Use 'new' keyword
                progress: progress, // Set progress from request body or default to 100
                completed: completed // Set completed from request body or default to true
            };
            formation.cours.push(course);
        } else {
            // If the course exists, update its completion status and progress
            course.completed = completed;
            course.progress = progress;
        }

        // Save the updated student document
        await student.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getFormationProgress = async (req, res) => {
    try {
        const { studentId, formationId } = req.params;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Find the formation by formationId within the student's formations
        const formation = student.formation.find(f => f.formationId.equals(formationId));
        if (!formation) {
            return res.status(404).json({ error: 'Formation not found' });
        }

        // Retrieve all courses related to the formation
        const allCourses = await Course.find({ formation: new mongoose.Types.ObjectId(formationId) }); // Correct usage with 'new'

        // Calculate the total number of courses in the formation
        const totalCourses = allCourses.length;

        // Calculate the number of completed courses for the student in the formation
        const completedCourses = formation.cours.filter(course => course.completed).length;

        // Compute the progress percentage
        const progressPercentage = totalCourses === 0 ? 0 : (completedCourses / totalCourses) * 100;

        // Return the progress percentage
        res.status(200).json({
            formationId: formationId,
            totalCourses: totalCourses,
            completedCourses: completedCourses,
            progressPercentage: progressPercentage.toFixed(2) // Round to 2 decimal places
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
