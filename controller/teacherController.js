const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Teacher  = require('../models/teachermodels');

// Create a new teacher
exports.createTeacher = async (req, res) => {
    try {
        const { name, lastname, email, specialization, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = new Teacher({
            name,
            lastname,
            email,
            specialization,
            password: hashedPassword
        });

        const savedTeacher = await teacher.save();

        // Prepare JSON data for response
        const responseData = {
            _id: savedTeacher._id,
            name: savedTeacher.name,
            lastname: savedTeacher.lastname,
            email: savedTeacher.email,
            specialization: savedTeacher.specialization
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Connexion d'un enseignant
exports.loginTeacher = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).send('Email and password are required!');
        }

        const teacher = await Teacher.findOne({ email: data.email });
        if (!teacher) {
            return res.status(404).send('Email or password invalid!');
        }

        if (!teacher.password) {
            return res.status(500).send('User password is missing!');
        }

        const validPass = bcrypt.compareSync(data.password, teacher.password);

        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        }

        const payload = {
            _id: teacher._id,
            email: teacher.email,
            name: teacher.name,
            specialization: teacher.specialization,
        };

        const token = jwt.sign(payload, '123456789');
        res.status(200).send({ mytoken: token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Obtenir tous les enseignants
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({});
        res.status(200).send(teachers);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir un enseignant par ID
exports.getTeacherById = async (req, res) => {
    const id = req.params.id;
    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }
        res.status(200).send(teacher);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Mettre à jour un enseignant
exports.updateTeacher = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).send(updatedTeacher);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer un enseignant
exports.deleteTeacher = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTeacher = await Teacher.findByIdAndDelete(id);
        res.status(200).send(deletedTeacher);
    } catch (error) {
        res.status(400).send(error);
    }
};
