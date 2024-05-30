const Formation = require('../models/formationmodels');
const Teacher  = require('../models/teachermodels');
const Cours = require('../models/coursmodels'); // Assuming you have a Cours model
const Category = require('../models/categorymodels'); // Assuming the category model file is named categorymodels
const Student = require('../models/studentmodels');

// Create a formation
// Function to create a new formation
exports.createFormation = async (req, res) => {
    try {
        const { name, description, image, cours, createdBy, category } = req.body;

        // Check if the createdBy field (teacher ID) exists
        const teacherExists = await Teacher.findById(createdBy);
        if (!teacherExists) {
            return res.status(400).json({ error: 'Teacher not found' });
        }

        // Check if the cours field (cours ID) exists
        const coursExists = await Cours.findById(cours);
        if (!coursExists) {
            return res.status(400).json({ error: 'Cours not found' });
        }

        // Check if the category field (category ID) exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Create a new formation instance
        const newFormation = new Formation({
            name,
            description,
            image,
            cours,
            createdBy,
            category
        });

        // Save the formation to the database
        const savedFormation = await newFormation.save();

        // Send the saved formation as the response
        res.status(201).json(savedFormation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating formation', error });
    }
};

const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File naming (timestamp + original extension)
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });




  
exports.updateFormation = async (req, res) => {
    try {
        const { name, description, createdBy, cours, image, category } = req.body;

        // Check if the createdBy field (teacher ID) exists
        const teacherExists = await Teacher.findById(createdBy);
        if (!teacherExists) {
            return res.status(400).json({ error: 'Teacher not found' });
        }

        // Check if the cours field (cours ID) exists
        const coursExists = await Cours.findById(cours);
        if (!coursExists) {
            return res.status(400).json({ error: 'Cours not found' });
        }

        // Check if the category field (category ID) exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Category not found' });
        }

        const formation = await Formation.findByIdAndUpdate(
            req.params.id,
            { name, description, createdBy, cours, image, category },
            { new: true }
        );
        if (!formation) {
            return res.status(404).json({ error: 'Formation not found' });
        }
        res.json(formation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllFormation = async (req, res) => {
    try {
        const formations = await Formation.find()
            .populate('category', 'name')
            .populate('cours', 'name'); // Assuming cours model has a 'name' field
        res.status(200).json(formations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getByIdFormation = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id)
            .populate('category', 'name')
            .populate('cours', 'name');
        if (!formation) {
            return res.status(404).json({ error: 'Formation not found' });
        }
        res.status(200).json(formation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByCreatedByIdFormation = async (req, res) => {
    try {
        const formations = await Formation.find({ createdBy: req.params.createdBy })
            .populate('category', 'name')
            .populate('cours', 'name');
        if (formations.length === 0) {
            return res.status(404).json({ error: 'No formations found for this creator' });
        }
        res.status(200).json(formations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFormationDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const formation = await Formation.findById(id)
        .populate('category', 'name')
        .populate('cours', 'name description');
  
      if (!formation) {
        return res.status(404).json({ error: 'Formation not found' });
      }
  
      const students = await Student.find({ 'formation.cours': { $in: formation.cours } });
  
      const formationWithProgress = formation.toObject();
      formationWithProgress.progress = students.map(student => {
        const studentProgress = student.formation.find(f => f.cours.toString() === id);
        return { student: student.name, progress: studentProgress ? studentProgress.progress : 0 };
      });
  
      res.status(200).json(formationWithProgress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.startFormation = async (req, res) => {
    console.log('here')
    try {
      const { studentId, formationId } = req.params;
  
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      // Check if the formation exists
      const formation = await Formation.findById(formationId);
      if (!formation) {
        return res.status(404).json({ error: 'Formation not found' });
      }
  
      // Check if the student has already started this formation
      if (student.formation.some(f => f.formationId.toString() === formationId)) {
        return res.status(400).json({ error: 'Student has already started this formation' });
      }
  
      // Add the formation to the student's formations
      student.formation.push({ formationId });
  
      // Save the updated student document
      await student.save();
  
      res.status(200).json({ message: 'Formation started successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.getUnstartedFormations = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      // Get all formations
      const formations = await Formation.find();
  
      // Filter out formations that the student has already started
      const unstartedFormations = formations.filter(formation => !student.formation.some(f => f.formationId.toString() === formation._id.toString()));
  
      res.status(200).json(unstartedFormations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  