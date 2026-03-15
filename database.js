const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt Optimization: Cache prompts in memory to eliminate disk I/O on reads
// Using stringified JSON prevents cache poisoning (acts as deep copy via JSON.parse)
let cachedPromptsString = null;

async function readPrompts() {
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (e) {
      // Invalidate on invalid JSON
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Verify cache hasn't been written to by another async operation
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // Do not cache error states
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const stringified = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, stringified, 'utf-8');
    // Only update cache after successful disk write
    cachedPromptsString = stringified;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
