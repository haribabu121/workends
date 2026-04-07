const mysql = require("mysql2");
require("dotenv").config();

let db = null;

// Only connect to database if credentials are available and not localhost
if (process.env.DB_HOST && 
    process.env.DB_HOST !== 'localhost' && 
    process.env.DB_USER && 
    process.env.DB_PASSWORD) {
  
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "myproject"
  });

  db.connect(err => {
    if (err) {
      console.error("Database connection failed, running without database:", err.message);
      db = null;
    } else {
      console.log("Database connected successfully");
    }
  });

  // Reconnect on connection loss
  db.on('error', (err) => {
    console.error("Database error:", err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      db.connect();
    } else {
      console.log("Database disconnected, continuing without database");
      db = null;
    }
  });
} else {
  console.log("No database credentials provided or using localhost, running without database");
}

module.exports = db;
