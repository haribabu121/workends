const express = require("express");
const router = express.Router();
const cmsStore = require("../cmsStore");
const { getAdminCredentials, signToken, verifyToken } = require("../middleware/adminAuth");

router.post("/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "").trim();
  const { email: adminEmail, password: adminPass } = getAdminCredentials();
  if (email !== adminEmail || password !== adminPass) {
    return res.status(401).json({ ok: false, message: "Invalid email or password" });
  }
  const token = signToken();
  res.json({ ok: true, token });
});

router.get("/me", verifyToken, (req, res) => {
  res.json({ ok: true, admin: true });
});

router.get("/products", verifyToken, async (req, res) => {
  try {
    console.log("Admin products route accessed");
    const data = await cmsStore.load(req.query.refresh === 'true');
    console.log("CMS data loaded successfully");
    res.json({ ok: true, products: data.products || [] });
  } catch (error) {
    console.error("Error in admin products route:", error);
    res.status(500).json({ ok: false, message: "Server error: " + error.message });
  }
});

router.post("/products", verifyToken, async (req, res) => {
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
  };
  data.products = [...(data.products || []), product];
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, product });
});

router.put("/products/:id", verifyToken, async (req, res) => {
  const data = await cmsStore.load();
  const id = Number(req.params.id);
  const idx = (data.products || []).findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, message: "Not found" });
  const body = req.body || {};
  const prev = data.products[idx];
  const updated = {
    ...prev,
    name: body.name != null ? String(body.name).trim() : prev.name,
    price: body.price != null ? String(body.price) : prev.price,
    rating: body.rating != null ? Number(body.rating) : prev.rating,
    description: body.description != null ? String(body.description) : prev.description,
    image: body.image != null ? String(body.image) : prev.image,
    features: body.features != null ? (Array.isArray(body.features) ? body.features : prev.features) : prev.features,
    active: body.active !== undefined ? Boolean(body.active) : prev.active,
  };
  data.products[idx] = updated;
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, product: updated });
});

router.patch("/products/:id/active", verifyToken, async (req, res) => {
  const data = await cmsStore.load();
  const id = Number(req.params.id);
  const idx = (data.products || []).findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, message: "Not found" });
  const active = Boolean(req.body.active);
  data.products[idx] = { ...data.products[idx], active };
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, product: data.products[idx] });
});

router.get("/gallery", verifyToken, async (req, res) => {
  const data = await cmsStore.load();
  res.json({ ok: true, gallery: data.gallery || [] });
});

router.put("/gallery", verifyToken, async (req, res) => {
  const data = cmsStore.load();
  const items = req.body.gallery;
  if (!Array.isArray(items)) {
    return res.status(400).json({ ok: false, message: "gallery must be an array" });
  }
  data.gallery = items.map((g, i) => ({
    id: g.id != null ? Number(g.id) : i + 1,
    image: String(g.image || ""),
    title: String(g.title || ""),
    description: String(g.description || ""),
    event: String(g.event || ""),
  }));
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, gallery: data.gallery });
});

router.post("/gallery", verifyToken, (req, res) => {
  const data = cmsStore.load();
  const body = req.body || {};
  const id = cmsStore.nextId(data.gallery || []);
  const item = {
    id,
    image: String(body.image || ""),
    title: String(body.title || ""),
    description: String(body.description || ""),
    event: String(body.event || "Event"),
  };
  data.gallery = [...(data.gallery || []), item];
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, item });
});

router.get("/banner", verifyToken, async (req, res) => {
  const data = await cmsStore.load();
  res.json({ ok: true, banner: data.banner || { text: "" } });
});

router.put("/banner", verifyToken, async (req, res) => {
  const data = await cmsStore.load();
  const text = String((req.body && req.body.text) || "");
  data.banner = { text };
  cmsStore.save(data);
  cmsStore.clearCache(); // Clear memory cache to force refresh
  res.json({ ok: true, banner: data.banner });
});

module.exports = router;
