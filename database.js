const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt: In-memory cache to prevent disk I/O on every API call
let promptsCache = null;

async function readPrompts() {
  // Return cached prompts if available to avoid expensive fs.readFile and JSON.parse
  if (promptsCache !== null) {
    // Return a deep copy to prevent accidental mutation leaking into the cache
    return JSON.parse(JSON.stringify(promptsCache));
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    promptsCache = JSON.parse(data);
    return JSON.parse(JSON.stringify(promptsCache));
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    promptsCache = [];
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
    // Update the cache only after a successful disk write
    promptsCache = JSON.parse(JSON.stringify(prompts));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
