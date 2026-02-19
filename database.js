const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache for prompts to avoid reading from disk on every request.
// This significantly improves read performance and helps prevent race conditions
// during concurrent write operations by maintaining a single source of truth in memory.
let promptsCache = null;

async function readPrompts() {
  if (!promptsCache) {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      promptsCache = JSON.parse(data);
    } catch (error) {
      console.error("Error reading from database:", error);
      // If file doesn't exist or is empty, return an empty array
      promptsCache = [];
    }
  }
  return promptsCache;
}

async function writePrompts(prompts) {
  // Update cache immediately to ensure subsequent reads get the latest data
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
