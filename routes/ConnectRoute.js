const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendAdminNotification1 } = require("../emailService");

router.options("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // If database is not available, just send email and return success
  if (!db) {
    console.log("Database not available, sending email only");
    try { 
      await sendAdminNotification1({ name, email, subject, message }); 
      return res.json({ success: true, message: "Message sent to admin (database unavailable)" });
    } 
    catch (emailErr) { 
      console.error("Email error:", emailErr);
      return res.status(500).json({ success: false, message: "Email service unavailable" });
    }
  }

  const sql = `INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, subject, message], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    try { await sendAdminNotification1({ name, email, subject, message }); } 
    catch (emailErr) { console.error("Email error:", emailErr); }

    res.json({ success: true, message: "Message stored & admin notified" });
  });
});

module.exports = router;
