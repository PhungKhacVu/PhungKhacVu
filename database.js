const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt Optimization: In-memory string cache
// Using a stringified JSON variable to reduce disk I/O.
// Parsing it acts as a deep copy to prevent cache poisoning by reference mutations.
let cachedPromptsString = null;

async function readPrompts() {
  // If cache exists, try to return parsed cache
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (parseError) {
      // Invalidate cache if parsing fails
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Cache the string before returning the parsed object
    cachedPromptsString = data;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array without caching the error state
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const stringifiedData = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringifiedData, 'utf-8');
    // Update the cache only after a successful disk write
    cachedPromptsString = stringifiedData;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
