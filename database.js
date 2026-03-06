const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt Optimization: In-memory cache to reduce disk I/O.
// We store as a stringified JSON to prevent cache poisoning (acts as deep copy on parse).
let cachedPromptsString = null;

async function readPrompts() {
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (e) {
      // Invalid JSON in cache, invalidate it and read from disk
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Validate JSON and cache it
    const parsedData = JSON.parse(data); // Will throw if invalid
    cachedPromptsString = data;
    return parsedData;
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array without caching the error state
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const dataString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, dataString, 'utf-8');
    // Only update cache after successful disk write
    cachedPromptsString = dataString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
