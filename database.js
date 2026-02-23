const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache
let promptsCache = null;

async function readPrompts() {
  if (promptsCache === null) {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      promptsCache = JSON.parse(data);
    } catch (error) {
      console.error("Error reading from database:", error);
      // If file doesn't exist or is empty, return an empty array
      promptsCache = [];
    }
  }
  // Return a deep copy to prevent mutation of the cache from outside
  return JSON.parse(JSON.stringify(promptsCache));
}

async function writePrompts(prompts) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
    // Update cache only after successful write
    promptsCache = JSON.parse(JSON.stringify(prompts));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
