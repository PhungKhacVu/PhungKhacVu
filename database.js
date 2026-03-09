const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt: In-memory cache to reduce disk I/O.
// We cache the stringified JSON to prevent cache poisoning (acts as deep copy via JSON.parse)
let cachedPromptsString = null;

async function readPrompts() {
  // ⚡ Bolt: Return parsed cached string if available
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (error) {
      // Safely invalidate cache if JSON is invalid
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Only cache if it hasn't been populated by a concurrent write
    if (cachedPromptsString === null) {
        cachedPromptsString = data; // Cache the string data
    }
    return JSON.parse(data);
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
    // ⚡ Bolt: Update cache only after successful disk write
    cachedPromptsString = dataString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
