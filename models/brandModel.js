// Import the sequelize instance from your database configuration file
const { sequelize } = require('../config/db'); // Assuming db.js exports { sequelize, mongoose }
const { DataTypes } = require('sequelize'); // Import DataTypes from sequelize

// Define the Brand model
const Brand = sequelize.define('Brand', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure brand names are unique
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING, // Store the filename of the image
        allowNull: true,
    },
}, {
    // Model options
    tableName: 'Brands', // Specify the table name (optional, Sequelize pluralizes by default)
    timestamps: true, // Adds createdAt and updatedAt columns
});

// Export the Brand model
module.exports = Brand;
