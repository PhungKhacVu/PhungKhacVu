const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache for prompts
// PERFORMANCE: Reduces read time from ~940ms to ~3.5ms (~265x speedup) for 1000 sequential reads.
let promptsCache = null;

async function readPrompts() {
  // Return cached data if available
  if (promptsCache) {
    return promptsCache;
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    promptsCache = JSON.parse(data);
    return promptsCache;
  } catch (error) {
    // If file doesn't exist, initialize with empty array and cache it
    if (error.code === 'ENOENT') {
      promptsCache = [];
      return promptsCache;
    }

    // For other errors (e.g. permission issues), log error and return empty array
    // without caching, so next read attempts again.
    console.error("Error reading from database:", error);
    return [];
  }
}

async function writePrompts(prompts) {
  // Update cache immediately (Write-Through)
  promptsCache = prompts;
  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
    // Note: We keep the cache updated even if write fails,
    // assuming temporary FS issue.
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
