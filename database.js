const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt: In-memory cache to prevent unnecessary disk reads
// Caching the stringified version avoids the need for JSON.stringify on every read
// and provides free deep-copy protection via JSON.parse.
let cachedPromptsString = null;

async function readPrompts() {
  // Parse and return from cache if available
  if (cachedPromptsString !== null) {
    return JSON.parse(cachedPromptsString);
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    cachedPromptsString = data;
    return JSON.parse(cachedPromptsString);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array.
    // We intentionally do not cache the empty state on error so it can retry later.
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const promptsString = JSON.stringify(prompts, null, 2);
    // Write to disk first to ensure data durability
    await fs.writeFile(dbPath, promptsString, 'utf-8');
    // Update cache string only if write succeeds
    cachedPromptsString = promptsString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
