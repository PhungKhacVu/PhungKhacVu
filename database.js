const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'prompts.json');

// In-memory cache stored as a stringified JSON variable to reduce disk I/O
// and prevent cache poisoning (acting as a deep copy via JSON.parse).
let cachedPromptsString = null;

async function readPrompts() {
  if (cachedPromptsString !== null) {
    try {
      return JSON.parse(cachedPromptsString);
    } catch (parseError) {
      console.error("Error parsing cached prompts, invalidating cache:", parseError);
      cachedPromptsString = null;
    }
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');

    // Parse once to validate and return
    const parsedData = JSON.parse(data);

    // Handle concurrent read races by verifying cache state after async reads
    // to prevent overwriting newer states.
    if (cachedPromptsString === null) {
      cachedPromptsString = data;
    }

    return parsedData;
  } catch (error) {
    console.error("Error reading from database:", error);
    // Return empty array on read errors without caching error states
    return [];
  }
}

async function writePrompts(prompts) {
  try {
    const formattedData = JSON.stringify(prompts, null, 2);
    await fs.writeFile(dbPath, formattedData, 'utf-8');
    // Update cache only after successful disk write
    cachedPromptsString = formattedData;
  } catch (error) {
    console.error("Error writing to database:", error);
    // Write errors are logged but not re-thrown
  }
}

module.exports = {
  readPrompts,
  writePrompts,
};
