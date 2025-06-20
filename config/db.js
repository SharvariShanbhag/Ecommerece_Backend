// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// --- MySQL Connection (Sequelize) ---
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false, // Set to true to see SQL queries in console
        dialectOptions: {
            // ssl: { require: true, rejectUnauthorized: false } // Uncomment for SSL if needed
        },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

const connectMySQL = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to MySQL:", error);
        process.exit(1); // Exit on critical connection failure
    }
};

// --- Database Initialization ---
const initializeDatabases = async () => {
    console.log("Attempting to connect to MySQL database...");
    await connectMySQL();
    console.log("MySQL database connection established.");
};

// Immediately invoke connection function when this module is imported
initializeDatabases();

// Export the sequelize instance
module.exports = {
    sequelize,
    // Removed mongoose as you are not using MongoDB
};