const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

let promptsCache = null;

async function readPrompts() {
  if (promptsCache) {
    return [...promptsCache];
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    promptsCache = JSON.parse(data);
    return [...promptsCache];
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // Do NOT cache the error state, allowing retry on next read
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    // Write to disk first
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), 'utf-8');
    // Update cache only if write succeeds
    promptsCache = [...prompts];
  } catch (error) {
    console.error("Error writing to database:", error);
    // Throw error so caller knows write failed (optional but good practice)
    // However, existing code might not handle it, so let's stick to logging as before
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
