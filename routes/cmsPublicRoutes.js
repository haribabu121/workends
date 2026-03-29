const express = require("express");
const router = express.Router();
const cmsStore = require("../cmsStore");

router.get("/products", async (req, res) => {
  const data = await cmsStore.load();
  const products = (data.products || []).filter((p) => p.active !== false);
  res.json({ ok: true, products });
});

router.get("/gallery", async (req, res) => {
  const data = await cmsStore.load();
  res.json({ ok: true, gallery: data.gallery || [] });
});

router.get("/banner", async (req, res) => {
  const data = await cmsStore.load();
  const text = (data.banner && data.banner.text) || "";
  res.json({ ok: true, banner: { text } });
});

module.exports = router;
