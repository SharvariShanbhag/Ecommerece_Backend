const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the sequelize instance

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: { // Store hashed password here
        type: DataTypes.STRING,
        allowNull: false
    },
    role: { // Example: 'user', 'admin' - This column was causing previous error
        type: DataTypes.STRING(20),
        defaultValue: 'user'
    },
    // Sequelize automatically adds createdAt and updatedAt if timestamps are true
}, {
    tableName: 'Users', // Explicitly set table name (plural is common)
    timestamps: true     // This will add createdAt and updatedAt columns automatically
});

// Define associations if any other models relate to User (e.g., if User creates Product)
// User.hasMany(Product, { foreignKey: 'createdBy', as: 'CreatedProducts' }); // Need to import Product first
// Product.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator' });

module.exports = User;