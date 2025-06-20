
   const { DataTypes } = require('sequelize');
   const { sequelize } = require('../config/db'); 

   const Product = sequelize.define('Product', {
       id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
           allowNull: false,
       },
       name: {
           type: DataTypes.STRING(255),
           allowNull: false,
       },
       description: {
           type: DataTypes.TEXT,
           allowNull: true,
       },
       price: {
           type: DataTypes.DECIMAL(10, 2),
           allowNull: false,
       },
       rating: {
           type: DataTypes.DECIMAL(2, 1),
           defaultValue: 0.0,
           validate: {
               min: 0.0,
               max: 5.0,
           },
       },
       quantity: {
           type: DataTypes.INTEGER,
           allowNull: false,
           defaultValue: 0,
       },
       inStock: {
           type: DataTypes.BOOLEAN,
           defaultValue: true,
       },
       image: {
           type: DataTypes.STRING,
           allowNull: true,
       },
       categoryId: {
           type: DataTypes.INTEGER,
           allowNull: false,
           references: {
               model: 'Categories', 
               key: 'id',
           }
       },
       brandId: {
           type: DataTypes.INTEGER,
           allowNull: false,
           references: {
               model: 'Brands', 
               key: 'id',
           }
       },
   }, {
       tableName: 'Products',
       timestamps: true,
   });

   Product.belongsTo(sequelize.models.Category, { 
       foreignKey: 'categoryId', 
       onDelete: 'CASCADE', // THIS IS THE KEY PART
       onUpdate: 'CASCADE' 
   });

   Product.belongsTo(sequelize.models.Brand, { 
       foreignKey: 'brandId', 
       onDelete: 'CASCADE', // THIS IS THE KEY PART
       onUpdate: 'CASCADE' 
   });

   module.exports = Product;
   
