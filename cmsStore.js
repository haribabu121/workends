const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'cms.json');
const SEED_FILE = path.join(__dirname, 'data', 'cms.seed.json');

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cmsStore = {
  async load(forceRefresh = false) {
    const now = Date.now();
    
    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && cache && (now - cacheTime) < CACHE_DURATION) {
      return cache;
    }

    try {
      // Try to load main data file first
      const data = await fs.readFile(DATA_FILE, 'utf8');
      cache = JSON.parse(data);
      cacheTime = now;
      return cache;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If main file doesn't exist, try seed file
        try {
          const seedData = await fs.readFile(SEED_FILE, 'utf8');
          cache = JSON.parse(seedData);
          cacheTime = now;
          // Save seed data as main data file
          await this.save(cache);
          return cache;
        } catch (seedError) {
          // If seed file also doesn't exist, return empty structure
          cache = {
            products: [],
            gallery: [],
            banner: { text: "" }
          };
          cacheTime = now;
          await this.save(cache);
          return cache;
        }
      }
      throw error;
    }
  },

  async save(data) {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
      cache = data;
      cacheTime = Date.now();
    } catch (error) {
      throw error;
    }
  },

  clearCache() {
    cache = null;
    cacheTime = 0;
  },

  nextId(items) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id || 0)) + 1;
  }
};

module.exports = cmsStore;
