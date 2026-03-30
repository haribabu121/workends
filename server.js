const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const connectRoutes = require("./routes/ConnectRoute");
const cmsPublicRoutes = require("./routes/cmsPublicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS configuration - must be first middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://www.akeventsandfireworks.online',
  'https://akeventsandfireworks.online',
  '*' // Allow all for Vercel compatibility
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow anyway for public API
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Explicit CORS headers as fallback for Vercel serverless
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/* ✅ BODY PARSER */
// Set limit to 5 MB to allow for 3 MB images + metadata
app.use(express.json({ limit: '5mb' }));

/* ✅ ROUTES */
app.use("/api/contact", contactRoutes);
app.use("/api/connect", connectRoutes);
app.use("/api/cms", cmsPublicRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);