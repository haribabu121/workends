const express = require("express");
const router = express.Router();
const cmsStore = require("../cmsStore");
const { getAdminCredentials, signToken, verifyToken } = require("../middleware/adminAuth");

// Test route to verify admin routes are loaded
router.get("/test", (req, res) => {
  console.log("Admin test route accessed");
  res.json({ 
    ok: true, 
    message: "Admin routes are working", 
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Enhanced login route with comprehensive error handling
router.post("/login", async (req, res) => {
  try {
    console.log("Admin login attempt started");
    
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        ok: false, 
        message: "Invalid request format" 
      });
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();
    
    console.log("Login attempt - Email provided:", !!email, "Password provided:", !!password);
    
    // Get admin credentials
    const { email: adminEmail, password: adminPass } = getAdminCredentials();
    console.log("Expected admin email:", adminEmail);
    
    // Validate environment variables
    if (!process.env.ADMIN_JWT_SECRET) {
      console.error("JWT_SECRET environment variable is missing!");
      return res.status(500).json({ 
        ok: false, 
        message: "Server configuration error - JWT secret not set" 
      });
    }
    
    // Validate credentials
    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        message: "Email and password are required" 
      });
    }
    
    if (email !== adminEmail || password !== adminPass) {
      console.log("Login failed: invalid credentials");
      return res.status(401).json({ 
        ok: false, 
        message: "Invalid email or password" 
      });
    }
    
    // Generate token
    const token = signToken();
    console.log("Login successful, token generated");
    
    res.json({ 
      ok: true, 
      token,
      message: "Login successful",
      expiresIn: "7d"
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Server error during login" 
    });
  }
});

// Enhanced me route
router.get("/me", verifyToken, (req, res) => {
  try {
    res.json({ 
      ok: true, 
      admin: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Me route error:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Server error" 
    });
  }
});

// Enhanced products routes
router.get("/products", verifyToken, async (req, res) => {
  try {
    console.log("Admin products route accessed");
    const data = await cmsStore.load(req.query.refresh === 'true');
    console.log("CMS data loaded successfully, products count:", (data.products || []).length);
    
    res.json({ 
      ok: true, 
      products: data.products || [],
      count: (data.products || []).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in admin products route:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to load products: " + error.message 
    });
  }
});

router.post("/products", verifyToken, async (req, res) => {
  try {
    console.log("Admin products POST route accessed");
    const data = await cmsStore.load();
    const body = req.body || {};
    
    const id = cmsStore.nextId(data.products || []);
    const product = {
      id,
      name: String(body.name || "new-product").trim(),
      price: String(body.price ?? "0"),
      rating: Number(body.rating) || 4.7,
      description: String(body.description || ""),
      image: String(body.image || ""),
      features: Array.isArray(body.features) ? body.features : [],
      active: body.active !== false,
      createdAt: new Date().toISOString()
    };
    
    data.products = [...(data.products || []), product];
    await cmsStore.save(data);
    cmsStore.clearCache();
    
    console.log("Product created successfully, ID:", id);
    res.json({ 
      ok: true, 
      product,
      message: "Product created successfully"
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to create product: " + error.message 
    });
  }
});

// Enhanced gallery routes
router.get("/gallery", verifyToken, async (req, res) => {
  try {
    console.log("Admin gallery route accessed");
    const data = await cmsStore.load();
    
    res.json({ 
      ok: true, 
      gallery: data.gallery || [],
      count: (data.gallery || []).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in admin gallery route:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to load gallery: " + error.message 
    });
  }
});

router.put("/gallery", verifyToken, async (req, res) => {
  try {
    console.log("Admin gallery PUT route accessed");
    const data = await cmsStore.load();
    const items = req.body.gallery;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ 
        ok: false, 
        message: "Gallery must be an array" 
      });
    }
    
    data.gallery = items.map((g, i) => ({
      id: g.id != null ? Number(g.id) : i + 1,
      image: String(g.image || ""),
      title: String(g.title || ""),
      description: String(g.description || ""),
      event: String(g.event || ""),
      updatedAt: new Date().toISOString()
    }));
    
    await cmsStore.save(data);
    cmsStore.clearCache();
    
    console.log("Gallery updated successfully, items count:", data.gallery.length);
    res.json({ 
      ok: true, 
      gallery: data.gallery,
      message: "Gallery updated successfully"
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to update gallery: " + error.message 
    });
  }
});

// Enhanced banner routes
router.get("/banner", verifyToken, async (req, res) => {
  try {
    console.log("Admin banner route accessed");
    const data = await cmsStore.load();
    
    res.json({ 
      ok: true, 
      banner: data.banner || { text: "" },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in admin banner route:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to load banner: " + error.message 
    });
  }
});

router.put("/banner", verifyToken, async (req, res) => {
  try {
    console.log("Admin banner PUT route accessed");
    const data = await cmsStore.load();
    const text = String((req.body && req.body.text) || "");
    
    data.banner = { 
      text,
      updatedAt: new Date().toISOString()
    };
    
    await cmsStore.save(data);
    cmsStore.clearCache();
    
    console.log("Banner updated successfully");
    res.json({ 
      ok: true, 
      banner: data.banner,
      message: "Banner updated successfully"
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Failed to update banner: " + error.message 
    });
  }
});

module.exports = router;
