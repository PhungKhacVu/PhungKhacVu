const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Bolt Optimization: In-memory cache to prevent disk I/O on every API call.
let cachedPrompts = null;

async function readPrompts() {
  // Return a deep copy of the cache to prevent mutations in route handlers
  // from affecting the cached data and other requests.
  if (cachedPrompts) {
    return JSON.parse(JSON.stringify(cachedPrompts));
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    cachedPrompts = JSON.parse(data);
    return JSON.parse(JSON.stringify(cachedPrompts));
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    // Update cache with a deep copy before writing to disk
    cachedPrompts = JSON.parse(JSON.stringify(prompts));
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
