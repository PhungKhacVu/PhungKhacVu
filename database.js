const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Performance optimization: Cache database contents in memory
// This avoids expensive fs.readFile() calls on every GET request
let cachedPromptsString = null;

async function readPrompts() {
  try {
    // Return cached data if available, eliminating disk read
    if (cachedPromptsString === null) {
      cachedPromptsString = await fs.readFile(dbPath, 'utf-8');
    }
    return JSON.parse(cachedPromptsString);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const jsonString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, jsonString, 'utf-8');
    // Update cache to stay in sync with disk, preventing stale reads
    cachedPromptsString = jsonString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
