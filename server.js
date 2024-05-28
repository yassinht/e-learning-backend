const express = require('express');
const cors = require('cors');
const mongoose = require('./config/connect.js');
const teacherRoute = require('./routes/teacher.js');
const etudiantRoute = require('./routes/etudiant.js');
const adminRoute = require('./routes/admin.js');
const categoryRoutes = require('./routes/category.js');
const coursRoutes = require('./routes/cours.js');
const chapitreRoutes = require('./routes/chapitre.js');
const formationRoutes = require('./routes/formation.js');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse urlencoded bodies
// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors(corsOptions));

// Routes
app.use('/teacher', teacherRoute);
app.use('/student', etudiantRoute);
app.use('/admin', adminRoute);
app.use('/category', categoryRoutes);
app.use('/cours', coursRoutes);
app.use('/chapitre', chapitreRoutes);
app.use('/formation', formationRoutes);

// Serving static files (assuming you want to serve images from './uploads' directory)
app.use('/getimage', express.static('./uploads'));

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
