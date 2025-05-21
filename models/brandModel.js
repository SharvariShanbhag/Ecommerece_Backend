const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Brand = sequelize.define('Brand', {
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
                msg: 'Brand name cannot be empty'
            },
            len: {
                args: [2, 30],
                msg: 'Brand name must be between 2 and 30 characters'
            }
        }
    }
}, {
    tableName: 'brands',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    // Either disable paranoid or add the deletedAt column to your database
    paranoid: false, // Set to false if you don't want soft deletion
    underscored: false,
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ],
    hooks: {
        beforeValidate: (brand) => {
            if (brand.name) {
                brand.name = brand.name.trim();
            }
        }
    }
});

module.exports = Brand;





// const {DataTypes} = require ('sequelize')
// const sequelize = require('../config/db')


// const Brand = sequelize.define('Brand',{//model name
//     id:{
//         type:DataTypes.INTEGER,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     name:{
//         type:DataTypes.STRING(30),
//         allowNull : false,
//         unique:true
//     }
// },{
//     tableName:'Brands',//table name
//     timestamps : true   //at create table or updated its true OTHERWISE FALSE

// });

// module.exports = Brand
