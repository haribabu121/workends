const fs = require("fs");
const path = require("path");

// Only load database in development, not on Vercel
let db = null;
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  try {
    db = require("./db");
    console.log("Database loaded successfully");
  } catch (error) {
    console.warn("Database not available, using file storage:", error.message);
  }
} else {
  console.log("Running in production/Vercel mode - using file storage");
}

const DEFAULT_DATA_DIR = path.join(__dirname, "data");
const TEMP_DATA_DIR = path.join("/tmp", "fireworks-cms");
const DATA_DIR = process.env.CMS_DATA_DIR || (process.env.VERCEL ? TEMP_DATA_DIR : DEFAULT_DATA_DIR);
const CMS_PATH = path.join(DATA_DIR, "cms.json");
const SEED_PATH = path.join(DEFAULT_DATA_DIR, "cms.seed.json");

// Default embedded data for Vercel (serverless environments without persistent file storage)
const DEFAULT_DATA = {
  "products": [
    {
      "id": 1,
      "name": "sparkcular-machines",
      "price": "7500",
      "rating": 4.8,
      "description": "A stunning display of colorful sparks.",
      "image": "https://tse4.mm.bing.net/th/id/OIP.i95cp4GA8-t8ZDRlzmkowwHaGS",
      "active": true
    },
    {
      "id": 2,
      "name": "fire-flame-machines",
      "price": "6000",
      "rating": 4.9,
      "description": "Powerful flame machine with strong visuals.",
      "image": "https://5.imimg.com/data5/NR/MV/DM/SELLER-31673312/flame-fire-machine.jpg",
      "active": true
    },
    {
      "id": 3,
      "name": "co2-jets",
      "price": "10000",
      "rating": 4.7,
      "description": "Beautiful CO2 jet effect.",
      "image": "https://tse4.mm.bing.net/th/id/OIP.H8SO6gvIrkrq3JE7XdKLlgHaHW",
      "active": true
    },
    {
      "id": 4,
      "name": "smoke-bubble-machines",
      "price": "5000",
      "rating": 4.7,
      "description": "Perfect for weddings and events.",
      "image": "https://m.media-amazon.com/images/I/71XRUGq9bBL.jpg",
      "active": true
    },
    {
      "id": 5,
      "name": "co2-jumbo-paper-machines",
      "price": "12000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://5.imimg.com/data5/SELLER/Default/2022/10/KO/CL/NP/102604979/1663308629h06942b37ce214c7fb7de4af487c07ef5e-1000x1000.jpg",
      "features": [
        "Elegant golden display",
        "shots: 10",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 6,
      "name": "co2 paper gun",
      "price": "10000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://tse3.mm.bing.net/th/id/OIP.4lLFDzNx3k0jSkkIeeQlDwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      "features": [
        "Elegant golden display",
        "shots:6 to 8 ",
        "Creates a romantic ambiance",
        "Perfect for stage programs"
      ],
      "active": true
    },
    {
      "id": 7,
      "name": "cold-fires",
      "price": "800",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/sykuhysgetY/maxresdefault.jpg",
      "features": [
        "Elegant golden display",
        "Duration: 30seconds",
        "Creates a romantic ambiance",
        "Perfect for weddings"
      ],
      "active": true
    },
    {
      "id": 8,
      "name": "Dry ice smoke machine ",
      "price": "4000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://tse1.mm.bing.net/th/id/OIP.Loh9p4wds6L7ifFmwQu2uwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 9,
      "name": "fan-wheel Rotator",
      "price": "6000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/80ZQrOqjoOE/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AGoA4AC8AGKAgwIABABGGUgWChXMA8=&rs=AOn4CLBW6hrjvR1xjDCYqBHPas2_ip_KVA",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 10,
      "name": "Ballon blast Entry",
      "price": "6000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://storage.googleapis.com/shy-pub/337348/SKU-1710_0-1731843277374.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 11,
      "name": "stage rotating machine",
      "price": "4500",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://tse3.mm.bing.net/th/id/OIP.2rj5NKIT5nt6NLcEI0SXcQHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 12,
      "name": "360 degree silfy booth",
      "price": "12000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://image.made-in-china.com/2f0j00EqfVLzvtuMGh/Magic-RGB-Lights-Mirror-Glass-Camera-Props-Selfie-Photo-Booth-360.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 13,
      "name": "stadium short",
      "price": "6000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://static.vecteezy.com/system/resources/previews/027/297/290/non_2x/football-soccer-field-stadium-at-night-and-fireworks-ai-generate-photo.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 14,
      "name": "Pot smoke Entry",
      "price": "5000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/gTnvo1PGKxI/hqdefault.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 15,
      "name": "paper-blower",
      "price": "5000/10000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://image.made-in-china.com/2f0j00iDrUgMntseoa/Easy-Hand-Control-Party-Strong-CO2-Confetti-Machine-Weding-Paper-Blaster-Blower-with-Flight-Case.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 16,
      "name": "Heart-shape rotating",
      "price": "2500",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://img.freepik.com/premium-photo/heart-shaped-fireworks-with-heart-shape-made-fireworks_147933-4235.jpg?w=2000",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 17,
      "name": "Dancing machine",
      "price": "1500",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/80ZQrOqjoOE/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AGoA4AC8AGKAgwIABABGGUgWChXMA8=&rs=AOn4CLBW6hrjvR1xjDCYqBHPas2_ip_KVA",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 18,
      "name": "Entry ",
      "price": "start from 10000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://cdn0.weddingwire.in/article/2376/original/1280/jpg/76732-couple-entry-ideas-dream-diaries-fireworks.jpeg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 19,
      "name": "Birthday car Entry",
      "price": "4500",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/5KBa9YkROuw/maxresdefault.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 20,
      "name": "food stall popkon stall",
      "price": "5000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://img.freepik.com/premium-photo/popcorn-stand-commercial-stall-preparing-selling-popcorn-snack_1061358-255768.jpg?w=2000",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 21,
      "name": "chocolate fountain",
      "price": "5000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://img.freepik.com/premium-photo/chocolate-fountain-with-chocolate-sauce-dripping-down-center_922940-1036.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 22,
      "name": "sugar candy",
      "price": "5000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://img.freepik.com/premium-photo/watercolor-illustration-fireworks-playful-bursts-candy-cane-red-mint-green_759095-172229.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 23,
      "name": "288 skyshot",
      "price": "2500",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://i.ytimg.com/vi/ovRMf-L4E_w/hqdefault.jpg?sqp=-oaymwEoCOADEOgC8quKqQMcGADwAQH4AbYIgAKAD4oCDAgAEAEYVCBlKEwwDw==&rs=AOn4CLCMYndEr7TXJZGEgBHbHOIJu-YhQw",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 24,
      "name": "vintage cars",
      "price": "15000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAzL3JtNjM0LWEtZWxlbWVudHNncm91cC10b24tMTktMDAxYy5qcGc.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    },
    {
      "id": 25,
      "name": "fireworks",
      "price": "15000",
      "rating": 4.7,
      "description": "Beautiful golden sparks that fall like rain, creating a magical and romantic atmosphere.",
      "image": "https://cdn.pixabay.com/photo/2022/11/11/22/32/fireworks-7585928_1280.jpg",
      "features": [
        "Elegant golden display",
        "shots:5",
        "Creates a romantic ambiance",
        "Perfect for Entry concepts"
      ],
      "active": true
    }
  ],
  "gallery": [
    {
      "id": 1,
      "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
      "title": "New Year Celebration 2025",
      "description": "Spectacular midnight fireworks display",
      "event": "New Year Celebration"
    },
    {
      "id": 2,
      "image": "https://c8.alamy.com/comp/2MPC9JP/visitors-watch-the-fireworks-display-during-a-new-year-celebration-event-at-the-hakkeijima-sea-paradise-aquarium-amusement-park-complex-in-yokohama-southwest-of-tokyo-monday-jan-1-2018-ap-photoshizuo-kambayashi-2MPC9JP.jpg",
      "title": "New Year Fireworks",
      "description": "Crowds gathered for the annual celebration",
      "event": "New Year Celebration"
    },
    {
      "id": 3,
      "image": "https://i.pinimg.com/originals/31/8e/74/318e7476fa76984b0685d3cde7511a39.jpg",
      "title": "Midnight Spectacle",
      "description": "Fireworks lighting up the night sky",
      "event": "New Year Celebration"
    },
    {
      "id": 4,
      "image": "https://i.pinimg.com/736x/ca/b9/f1/cab9f12141267677a4220eeb44af70ca.jpg",
      "title": "Sankranthi Festival",
      "description": "Traditional harvest festival celebrations",
      "event": "Sankranthi Festival"
    },
    {
      "id": 5,
      "image": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=549&h=415&q=80",
      "title": "Festival Rituals",
      "description": "Cultural performances and traditions",
      "event": "Sankranthi Festival"
    },
    {
      "id": 6,
      "image": "https://i.pinimg.com/736x/92/cf/9b/92cf9b901a421471ee4b6f7b9055b8f7.jpg",
      "title": "River Bank Celebrations",
      "description": "Festive atmosphere by the Godavari river",
      "event": "Sankranthi Festival"
    },
    {
      "id": 7,
      "image": "https://www.sparkfx.com.au/wp-content/uploads/2019/01/3.jpg",
      "title": "Wedding Fireworks",
      "description": "Romantic wedding ceremony with fireworks",
      "event": "Wedding Celebration"
    },
    {
      "id": 8,
      "image": "https://flashfireworks.com.au/wp-content/uploads/2020/11/indoor-fireworks-wedding-background-1536x1026.jpg",
      "title": "Bridal Entrance",
      "description": "Magical entrance with custom fireworks",
      "event": "Wedding Celebration"
    },
    {
      "id": 9,
      "image": "https://media.istockphoto.com/id/2098903945/photo/the-bride-and-groom-on-the-wedding-ceremony-venue-with-fireworks-at-night.webp?a=1&b=1&s=612x612&w=0&k=20&c=tBkj3dAmiFhF03fTjDRAhItFa2Zd5vw3FdxfetZ8OYk=",
      "title": "Reception Spectacle",
      "description": "Grand reception with fireworks finale",
      "event": "Wedding Celebration"
    },
    {
      "id": 10,
      "image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2074&q=80",
      "title": "Corporate Event",
      "description": "Professional fireworks for business events",
      "event": "Corporate Event"
    }
  ],
  "banner": {
    "text": "Book now and get 10% off on all services! Limited time offer: Free decoration with every booking!"
  }
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn("Warning: Could not create data directory (running on serverless environment)");
  }
}

let memoryData = null;

function readSeed() {
  try {
    if (!fs.existsSync(SEED_PATH)) {
      return DEFAULT_DATA;
    }
    return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  } catch (err) {
    console.warn("Warning: Using embedded default data", err.message);
    return DEFAULT_DATA;
  }
}

function load(forceRefresh = false) {
  if (memoryData && !forceRefresh) {
    return memoryData;
  }

  // Try to load from database first (only if available)
  return new Promise((resolve) => {
    if (db) {
      db.query('SELECT * FROM cms_data WHERE id = 1', (err, results) => {
        if (err) {
          console.warn("DB load failed:", err.message);
          // Fallback to file
          try {
            ensureDataDir();
            if (!fs.existsSync(CMS_PATH)) {
              const seed = readSeed();
              save(seed);
              memoryData = seed;
              resolve(seed);
            } else {
              const fileData = JSON.parse(fs.readFileSync(CMS_PATH, "utf8"));
              memoryData = fileData;
              resolve(fileData);
            }
          } catch (fileErr) {
            console.warn("File load failed:", fileErr.message, "- Using seed data");
            memoryData = data;
            resolve(data);
          } catch (parseErr) {
            console.warn("Data parse error:", parseErr.message, "- Using seed data");
            try {
              const seed = readSeed();
              save(seed);
              memoryData = seed;
              resolve(seed);
            } catch (saveErr) {
              console.warn("Seed save failed:", saveErr.message);
              memoryData = readSeed();
              resolve(memoryData);
            }
          }
        } else if (results.length > 0) {
          const data = JSON.parse(results[0].data);
          memoryData = data;
          resolve(data);
        } else {
          // No data in DB, use seed
          const seed = readSeed();
          save(seed);
          memoryData = seed;
          resolve(seed);
        }
      });
    } else {
      // No database available, use file storage
      try {
        ensureDataDir();
        if (!fs.existsSync(CMS_PATH)) {
          const seed = readSeed();
          save(seed);
          memoryData = seed;
          resolve(seed);
        } else {
          const fileData = JSON.parse(fs.readFileSync(CMS_PATH, "utf8"));
          memoryData = fileData;
          resolve(fileData);
        }
      } catch (parseErr) {
        console.warn("Data parse error:", parseErr.message, "- Using seed data");
        const seed = readSeed();
        save(seed);
        memoryData = seed;
        resolve(seed);
      }
    }
  });
}

function save(data) {
  memoryData = data; // Update cache
  
  // Try to save to database (only if available)
  if (db) {
    try {
      const jsonData = JSON.stringify(data);
      db.query('INSERT INTO cms_data (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?', [jsonData, jsonData], (err) => {
        if (err) {
          console.warn("DB save error:", err.message);
          // Fallback to file
          try {
            ensureDataDir();
            fs.writeFileSync(CMS_PATH, JSON.stringify(data, null, 2), "utf8");
          } catch (fileErr) {
            console.warn("File save failed:", fileErr.message);
          }
        }
      });
    } catch (dbErr) {
      console.warn("DB save error:", dbErr.message);
      // Fallback to file
      try {
        ensureDataDir();
        fs.writeFileSync(CMS_PATH, JSON.stringify(data, null, 2), "utf8");
      } catch (fileErr) {
        console.warn("File save failed:", fileErr.message);
      }
    }
  } else {
    // No database available, use file storage
    try {
      ensureDataDir();
      fs.writeFileSync(CMS_PATH, JSON.stringify(data, null, 2), "utf8");
    } catch (fileErr) {
      console.warn("File save failed:", fileErr.message);
    }
  }
}

function clearCache() {
  memoryData = null; // Clear memory cache
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((x) => Number(x.id) || 0)) + 1;
}

module.exports = { load, save, nextId, CMS_PATH, clearCache };
