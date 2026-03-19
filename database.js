const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Memory cache for the raw JSON string to eliminate high-frequency disk reads.
// Using a string acts as a deep copy on parse, preventing in-memory mutations
// from poisoning the cache.
let cachedPromptsString = null;

async function readPrompts() {
  try {
    // Return parsed cache if available to save disk I/O
    if (cachedPromptsString !== null) {
      return JSON.parse(cachedPromptsString);
    }

    const data = await fs.readFile(dbPath, 'utf-8');

    // Validate JSON before caching
    const parsed = JSON.parse(data);

    // Only cache if parsing succeeds and state hasn't been updated concurrently
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }
    return parsed;
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array without caching error state
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const jsonString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, jsonString, 'utf-8');
    // Update cache only after successful disk write
    cachedPromptsString = jsonString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
