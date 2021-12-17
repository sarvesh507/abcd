const sqlconfig = {
  user: "sa",
  password: "Chetu@123",
  host: "localhost",
  database: "Gransfer",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// const dbconfig = {
//   db: {
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "PASSWORD",
//     database: process.env.DB_NAME || "DB_NAME",
//   },
//   listPerPage: process.env.LIST_PER_PAGE || 10,
// };

module.exports = sqlconfig;

// const mongoose = require("mongoose");
// const mongo_url = process.env.MONGO_URL;

// mongoose
//   .connect(mongo_url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Successfully connected to Mongodb database");
//   })
//   .catch((err) => {
//     console.log("Could not connect to the database. Exiting now...", err);
//   });
