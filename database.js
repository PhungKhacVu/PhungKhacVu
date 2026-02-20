const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache for prompts
let promptsCache = null;

async function readPrompts() {
  // Return cached data if available to avoid disk I/O
  if (promptsCache) {
    // Return a shallow copy to prevent external mutation affecting the cache structure unexpectedly
    return [...promptsCache];
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    promptsCache = JSON.parse(data);
    return [...promptsCache];
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    promptsCache = [];
    return [];
  }
}

async function writePrompts(prompts) {
  // Update cache immediately
  promptsCache = prompts;

  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
