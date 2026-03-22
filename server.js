const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const connectRoutes = require("./routes/ConnectRoute");
const cmsPublicRoutes = require("./routes/cmsPublicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());

// // CORS configuration
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://www.akeventsandfireworks.online',
//   // 'https://akeventsandfireworks.online',
//   'https://workend-at05t93jn-haribabu121s-projects.vercel.app'
// ];

// // Middleware to handle CORS
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
  
//   // Check if the request origin is in the allowed origins
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', true);
//   }
  
  // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ ROUTES */
app.use("/api/contact", contactRoutes);
app.use("/api/connect", connectRoutes);
app.use("/api/cms", cmsPublicRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);