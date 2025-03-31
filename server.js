const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const { sequelize } = require('./models/inventoryModel'); // Import Sequelize connection
const { Sales } = require('./models/salesModel'); // Import Sales model
const inventoryRoutes = require('./routes/inventoryRoute');
const salesRoutes = require('./routes/salesRoute');

// Load Environment Variables
dotenv.config();
console.log('Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, JS, etc.)
app.set('view engine', 'ejs');

// Sync Database (Ensure tables exist)
sequelize.sync({ alter: true }) // Use { force: true } only if you want to drop and recreate tables
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error syncing database:', err));

// Register Routes
app.use('/', inventoryRoutes);
app.use('/sales', salesRoutes);

// 404 Error Handling
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
