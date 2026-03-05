const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// Performance optimization: Cache the raw stringified JSON in memory
// This avoids expensive disk I/O on every API request.
// We store the stringified version and JSON.parse() it on every read.
// This acts as a deep copy, preventing route handlers from mutating
// the cached data directly (cache poisoning) while remaining much faster than fs.readFile.
let cachedPromptsString = null;

async function readPrompts() {
  // Try to serve from cache first
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (parseError) {
      // If parsing fails (invalid JSON), invalidate cache and fallback to disk
      console.warn("Error parsing cached database data, falling back to disk read:", parseError);
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Update cache with the stringified data we just read
    cachedPromptsString = data;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // We intentionally don't cache the error state
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const stringifiedData = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringifiedData, 'utf-8');
    // Only update cache after successful write to disk
    cachedPromptsString = stringifiedData;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
