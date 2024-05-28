const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Admin } = require('../models/adminmodels');

// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
    try {
        const data = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Replace plain text password with hashed password
        data.password = hashedPassword;
        
        const admin = new Admin(data);
        const savedAdmin = await admin.save();
        res.status(200).send(savedAdmin);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Connexion d'un administrateur
exports.loginAdmin = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).send('Email and password are required!');
        }

        const admin = await Admin.findOne({ email: data.email });
        if (!admin) {
            return res.status(404).send('Email or password invalid!');
        }

        if (!admin.password) {
            return res.status(500).send('User password is missing!');
        }

        const validPass = bcrypt.compareSync(data.password, admin.password);

        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        }

        const payload = {
            _id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        };

        const token = jwt.sign(payload, 'your_secret_key');
        res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Obtenir tous les administrateurs
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.status(200).send(admins);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir un administrateur par ID
exports.getAdminById = async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send({ message: 'Admin not found' });
        }
        res.status(200).send(admin);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Mettre à jour un administrateur
exports.updateAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).send(updatedAdmin);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer un administrateur
exports.deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        res.status(200).send(deletedAdmin);
    } catch (error) {
        res.status(400).send(error);
    }
};
