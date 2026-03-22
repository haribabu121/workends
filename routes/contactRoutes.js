const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendAdminNotification } = require("../emailService");

router.post("/", async (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  
  const sql = `INSERT INTO contact_messages (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, phone, email, subject, message], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    try { await sendAdminNotification({ name, phone, email, subject, message }); } 
    catch (emailErr) { console.error("Email error:", emailErr); }

    res.json({ success: true, message: "Message stored & admin notified" });
  });
});

module.exports = router;
