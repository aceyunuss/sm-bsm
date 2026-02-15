const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const db_smbsm = new Sequelize({
  database: process.env.DB_NAME_SMBSM,
  username: process.env.DB_USERNAME_SMBSM,
  password: process.env.DB_PASSWORD_SMBSM,
  host: process.env.DB_HOST_SMBSM,
  port: process.env.DB_PORT_SMBSM,
  dialect: "postgres",
  query: { raw: true },
  // logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { db_smbsm };
