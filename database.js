const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache to prevent disk I/O on every API call
let cache = null;

async function readPrompts() {
  try {
    if (cache !== null) {
      // Return a deep copy to prevent accidental mutation by route handlers
      return JSON.parse(JSON.stringify(cache));
    }
    const data = await fs.readFile(dbPath, 'utf-8');
    cache = JSON.parse(data);
    return JSON.parse(JSON.stringify(cache));
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    cache = [];
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
    // Update cache on successful write
    cache = JSON.parse(JSON.stringify(prompts));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
