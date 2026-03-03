const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// ⚡ Bolt: Parse from in-memory string cache to avoid disk I/O on every API request.
// A string is used to prevent cache poisoning since JSON.parse acts as a deep copy.
let cachedPromptsString = null;

async function readPrompts() {
  try {
    if (cachedPromptsString !== null) {
      return JSON.parse(cachedPromptsString);
    }
    const data = await fs.readFile(dbPath, 'utf-8');
    cachedPromptsString = data;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from database:", error);
    // If file doesn't exist or is empty, return an empty array
    // Do not cache the error state, let it try reading again later if needed
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const dataStr = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, dataStr, 'utf-8');
    // ⚡ Bolt: Only update cache upon successful disk write to maintain consistency
    cachedPromptsString = dataStr;
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
