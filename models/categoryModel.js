const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Category name cannot be empty'
            },
            len: {
                args: [2, 30],
                msg: 'Category name must be between 2 and 30 characters'
            }
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    underscored: true,
    defaultScope: {
        where: { is_active: true }
    }
});

module.exports = {Category};







// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Category = sequelize.define('Category', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING(30),
//         allowNull: false,
//         unique: true
//     }
// }, {
//     tableName: 'categories', 
//     timestamps: true 
// });

// module.exports = Category;