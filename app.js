// app.js

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Ensure dotenv is loaded at the very top

// Only destructure sequelize, as mongoose is not used
const { sequelize } = require('./config/db');

// Your Sequelize models - these are fine
const User = require('./models/userModel');
const Brand = require('./models/brandModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');

Brand.hasMany(Product, { foreignKey: 'brandId', as: 'Products' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'Products' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *** CRITICAL FIX FOR CORS ***
// Add your frontend's actual origin: http://localhost:5173
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your routes
const brandRoute = require('./routes/brandRoute');
app.use('/api/brand', brandRoute);

const productRoute = require('./routes/productRoute');
app.use('/api/product', productRoute);

const categoryRoute = require('./routes/categoryRoute');
app.use('/api/category', categoryRoute);

const userRoute = require('./routes/userRoute');
app.use('/api/user', userRoute);

(async () => {
    try {
        // Ensure you have connected to the database before syncing models
        // The `initializeDatabases()` in db.js handles the connection when imported.
        // sequelize.sync will ensure your tables are created/updated based on your models.
        await sequelize.sync({ force: false });
        console.log('MySQL models synchronized.'); // Changed message to reflect force:false

        const PORT = process.env.PORT || 7001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Fatal error during database sync or server start:', error);
        process.exit(1);
    }
})();