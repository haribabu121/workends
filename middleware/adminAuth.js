const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "akevents-cms-dev-secret";

function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || "akeventsandfireworks@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "AkEvents@98";
  return {
    email: email.trim().toLowerCase(),
    password: String(password).trim(),
  };
}

function signToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  console.log("Auth middleware: checking token, JWT_SECRET exists:", !!process.env.ADMIN_JWT_SECRET);
  
  if (!token) {
    console.log("Auth middleware: no token provided");
    return res.status(401).json({ ok: false, message: "Missing token" });
  }
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware: token verified successfully");
    next();
  } catch (error) {
    console.error("Auth middleware: token verification failed:", error.message);
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
}

module.exports = { getAdminCredentials, signToken, verifyToken, JWT_SECRET };
