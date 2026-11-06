require("dotenv").config();

const { Sequelize } = require("sequelize");

const config = require("../config/database.config");

const databaseConfig =
    config[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig
);

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();

        console.log("MySQL connected successfully");
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = {
    sequelize,
    connectDatabase
};