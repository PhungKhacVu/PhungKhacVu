const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Performance optimization: Cache stringified JSON to reduce disk I/O.
// JSON.parse acts as a deep copy to prevent cache poisoning.
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
    const parsedData = JSON.parse(data);

    // Handle concurrent read races by updating only if still null
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }

    return parsedData;
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array without caching error states
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const stringifiedPrompts = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringifiedPrompts, 'utf-8');

    // Update cache only after successful disk write
    cachedPromptsString = stringifiedPrompts;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
