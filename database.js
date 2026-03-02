const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory stringified cache to eliminate disk I/O on reads
// while preventing cache poisoning via JSON.parse deep copy
let cachedPromptsString = null;

async function readPrompts() {
  try {
    if (cachedPromptsString !== null) {
      return JSON.parse(cachedPromptsString);
    }
    const data = await fs.readFile(dbPath, 'utf-8');
    cachedPromptsString = data;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const dataString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, dataString, 'utf-8');
    // Only update cache after successful write to disk
    cachedPromptsString = dataString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
