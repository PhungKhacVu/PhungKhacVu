const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Performance Optimization: In-memory stringified cache
// Why: Reduces massive disk I/O on every read request
// How: Caches the stringified JSON to prevent accidental reference mutations (cache poisoning)
let cachedPromptsString = null;

async function readPrompts() {
  // If we have a cached string, parse and return it to act as a fast deep copy
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (parseError) {
      console.error("Error parsing cached database:", parseError);
      cachedPromptsString = null; // Invalidate cache on parse error
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Verify JSON validity before caching and store the parsed result
    const parsedData = JSON.parse(data);

    // Handle concurrent read races: only update cache if it hasn't been updated
    // by another concurrent request while we were reading from disk
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
    const stringifiedData = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringifiedData, 'utf-8');
    // Update cache only after successful disk write
    cachedPromptsString = stringifiedData;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
