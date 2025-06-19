const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
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

// --- MongoDB Connection (Mongoose) ---
const connectMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db';
        await mongoose.connect(mongoURI, {
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
        });
        console.log("MongoDB connected successfully");
        try {
            const url = new URL(mongoURI);
            console.log(`MongoDB running on host: ${url.hostname}, port: ${url.port || '27017 (default)'}`);
        } catch (parseError) {
            console.warn("Could not parse MongoDB URI for detailed host/port info.");
        }
    } catch (error) {
        console.error("Unable to connect to MongoDB:", error);
        process.exit(1); // Exit on critical connection failure
    }
};

// --- Combined Database Initialization ---
const initializeDatabases = async () => {
    console.log("Attempting to connect to databases...");
    await connectMySQL();
    await connectMongoDB();
    console.log("All database connections established.");
};

// Immediately invoke connection function when this module is imported
initializeDatabases();

// Export the instances
module.exports = {
    sequelize,
    mongoose
};