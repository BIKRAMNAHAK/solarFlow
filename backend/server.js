const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
require('./Configs/db_config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Seeders on start
const { ensureInitialAdmin } = require('./Controllers/authController');
const { ensureInitialPanels } = require('./Controllers/panelController');
const { ensureInitialEmployees } = require('./Controllers/employeeController');

setTimeout(() => {
  ensureInitialAdmin();
  ensureInitialPanels();
  ensureInitialEmployees();
}, 2000);

// Routes
const Router = require('./Routes/Routers');
app.use('/', Router);

// Root health route
app.get('/', (req, res) => {
  res.json({ message: 'SolarFlow API is running smoothly', time: new Date() });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is running on port http://localhost:${PORT}`);
  } else {
    console.error('Server error:', err);
  }
});