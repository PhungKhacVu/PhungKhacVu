const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache using a stringified JSON variable to reduce disk I/O and prevent cache poisoning (acting as a deep copy via JSON.parse).
let cachedPromptsString = null;

async function readPrompts() {
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (error) {
      console.error("Error parsing cached prompts string. Invalidating cache.", error);
      cachedPromptsString = null; // Invalidate invalid JSON
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Verify cache state after async read to prevent overwriting newer states from concurrent writes
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array without caching error states
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const stringifiedData = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringifiedData, 'utf-8');
    // Only update cache after successful disk write
    cachedPromptsString = stringifiedData;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
