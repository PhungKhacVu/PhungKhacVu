// WARNING: This script modifies the database/prompts.json file.
// It attempts to restore the original state, but use with caution.

const { readPrompts, writePrompts } = require('../database');
const assert = require('assert');

async function verify() {
  console.log("Starting verification...");

  // 1. Initial Read
  const initialPrompts = await readPrompts();
  console.log(`Initial prompts count: ${initialPrompts.length}`);

  try {
    // 2. Add a new prompt
    const newPrompt = { id: 'test-verify-' + Date.now(), title: 'Test Verification Prompt' };
    const updatedPrompts = [...initialPrompts, newPrompt];

    // 3. Write updates
    await writePrompts(updatedPrompts);
    console.log("Wrote updated prompts.");

    // 4. Read back and verify
    const promptsAfterWrite = await readPrompts();
    assert.strictEqual(promptsAfterWrite.length, initialPrompts.length + 1, "Prompts count mismatch after write");
    const lastPrompt = promptsAfterWrite[promptsAfterWrite.length - 1];
    assert.strictEqual(lastPrompt.id, newPrompt.id, "Last prompt ID mismatch");
    console.log("Verification successful: Write correctly updated data.");

  } catch (error) {
    console.error("Verification failed:", error);
    process.exitCode = 1;
  } finally {
    // 5. Cleanup (restore original state)
    console.log("Restoring original prompts...");
    await writePrompts(initialPrompts);
    const finalPrompts = await readPrompts();
    if (finalPrompts.length !== initialPrompts.length) {
      console.error("CRITICAL: Failed to restore original prompts count!");
      process.exit(1);
    }
    console.log("Restored original prompts.");
  }
}

verify();
