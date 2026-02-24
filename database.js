const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache for prompts to reduce disk I/O
let promptsCache = null;

async function readPrompts() {
  // Return cached data if available
  if (promptsCache) {
    // Return a shallow copy to prevent external mutation of the cache
    return [...promptsCache];
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    promptsCache = JSON.parse(data);
    return [...promptsCache];
  } catch (error) {
    // Only cache empty array if file truly doesn't exist
    if (error.code === 'ENOENT') {
      promptsCache = [];
      return [];
    }

    console.error("Error reading from database:", error);
    // For other errors (e.g. permissions), return empty but don't cache
    // so we can try to recover on next request
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
    // Update cache only after successful write to ensure consistency
    promptsCache = [...prompts];
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
