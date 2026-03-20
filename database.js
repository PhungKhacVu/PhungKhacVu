const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt Performance Optimization: In-memory cache
// Caching the stringified JSON prevents repeated disk I/O on every request.
// Returning JSON.parse(cachedPromptsString) acts as a deep copy to prevent cache poisoning.
let cachedPromptsString = null;

async function readPrompts() {
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (e) {
      // Safely invalidate on invalid JSON
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');

    // Validate JSON before caching
    JSON.parse(data);

    // Handle concurrent read races by verifying cache state after async read
    // to prevent overwriting newer states.
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }

    return JSON.parse(cachedPromptsString);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // Return empty array on read errors without caching error states
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const dataString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, dataString, 'utf-8');
    // Update cache only after successful disk write
    cachedPromptsString = dataString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
