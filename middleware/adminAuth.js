const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "akevents-cms-dev-secret";

console.log("AdminAuth middleware loaded with JWT_SECRET:", !!JWT_SECRET);

function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || "akeventsandfireworks@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "AkEvents@98";
  console.log("Admin credentials loaded:", {
    email: email.trim().toLowerCase(),
    hasPassword: !!password,
    envEmail: !!process.env.ADMIN_EMAIL,
    envPassword: !!process.env.ADMIN_PASSWORD
  });
  return {
    email: email.trim().toLowerCase(),
    password: String(password).trim(),
  };
}

function signToken() {
  console.log("Signing token with JWT_SECRET:", !!JWT_SECRET);
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  console.log("Auth middleware: checking token, JWT_SECRET exists:", !!process.env.ADMIN_JWT_SECRET);
  console.log("Auth middleware: token provided:", !!token);
  
  if (!token) {
    console.log("Auth middleware: no token provided");
    return res.status(401).json({ ok: false, message: "Missing token" });
  }
  
  if (!JWT_SECRET) {
    console.error("Auth middleware: JWT_SECRET is missing!");
    return res.status(500).json({ ok: false, message: "Server configuration error" });
  }
  
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware: token verified successfully");
    next();
  } catch (error) {
    console.error("Auth middleware: token verification failed:", error.message);
    console.error("JWT_SECRET being used:", JWT_SECRET ? "exists" : "missing");
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
}

module.exports = { getAdminCredentials, signToken, verifyToken, JWT_SECRET };
