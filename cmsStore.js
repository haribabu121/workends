const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const CMS_PATH = path.join(DATA_DIR, "cms.json");
const SEED_PATH = path.join(DATA_DIR, "cms.seed.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readSeed() {
  if (!fs.existsSync(SEED_PATH)) {
    return { products: [], gallery: [], banner: { text: "" } };
  }
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
}

function load() {
  ensureDataDir();
  if (!fs.existsSync(CMS_PATH)) {
    const seed = readSeed();
    save(seed);
    return seed;
  }
  return JSON.parse(fs.readFileSync(CMS_PATH, "utf8"));
}

function save(data) {
  ensureDataDir();
  fs.writeFileSync(CMS_PATH, JSON.stringify(data, null, 2), "utf8");
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((x) => Number(x.id) || 0)) + 1;
}

module.exports = { load, save, nextId, CMS_PATH };
