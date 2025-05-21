// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Product = sequelize.define('Product', {
//     name: {
//         type: DataTypes.STRING(100),
//         allowNull: false
//     },
//     description: DataTypes.STRING(255),
//     // price: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },
//     price: {
//         type: DataTypes.FLOAT, 
//         allowNull: false
//     },
//     category_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     brand_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     // Quantity: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false
//     // },

//     Quantity: {
//   type: DataTypes.INTEGER,
//   allowNull: false,
//   validate: {
//     min: 0 
//   }
// },
//     InStock: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true
//     }
// }, {
//     timestamps: true, // This enables createdAt and updatedAt
//     createdAt: 'createdAt', // Customize the field name if needed
//     updatedAt: 'updatedAt'
// });

// module.exports = Product;




const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true // Ensures name isn't an empty string
        }
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true // Optional field
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Better for currency than FLOAT
        allowNull: false,
        validate: {
            min: 0 // Price can't be negative
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true // Ensures it's an integer
        }
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default to 0 if not provided
        validate: {
            min: 0 // Quantity can't be negative
        }
    },
    InStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // Automatically set to true if not provided
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Add associations (if you have Category and Brand models)
Product.associate = (models) => {
    Product.belongsTo(models.Category, { 
        foreignKey: 'category_id',
        as: 'category' // Optional: gives you product.getCategory()
    });
    Product.belongsTo(models.Brand, { 
        foreignKey: 'brand_id',
        as: 'brand' // Optional: gives you product.getBrand()
    });
};

module.exports = Product;