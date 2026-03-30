const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myproject"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    // Don't throw, just log - serverless functions may retry
  } else {
    console.log("✅ MySQL connected");
  }
});

// Reconnect on connection loss
db.on('error', (err) => {
  console.error("❌ Database error:", err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') db.connect();
  if(err.code === 'ER_CON_COUNT_ERROR') db.connect();
  if(err.code === 'ER_CONNECTION_KILLED') db.connect();
});

module.exports = db;
