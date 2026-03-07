const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

let cachedPromptsString = null;

async function readPrompts() {
  try {
    // ⚡ Bolt: Cache read results as stringified JSON to reduce disk I/O
    // We use JSON.parse here to act as a deep copy, preventing cache poisoning
    // by callers modifying the returned array.
    if (cachedPromptsString !== null) {
      return JSON.parse(cachedPromptsString);
    }
    const data = await fs.readFile(dbPath, 'utf-8');
    const parsed = JSON.parse(data);
    cachedPromptsString = data;
    return parsed;
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // ⚡ Bolt: Do not cache error state
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const dataString = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, dataString, 'utf-8');
    // ⚡ Bolt: Update the cache only after a successful disk write
    cachedPromptsString = dataString;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
