// ecommerce_backend/models/categoryModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the sequelize instance

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true // Category names should probably be unique
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: { // Stores the filename of the uploaded category image
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Categories', // Explicitly set table name
    timestamps: true         // Adds createdAt and updatedAt columns automatically
});

// Define associations: A Category can have many Products (defined in app.js for consistency)
// Category.hasMany(Product, { foreignKey: 'categoryId', as: 'Products' });

module.exports = Category;