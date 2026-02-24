const { readPrompts, writePrompts } = require('../database');
const fs = require('fs/promises');
const path = require('path');
const assert = require('assert');

const dbPath = path.join(__dirname, '../database/prompts.json');
const originalDbPath = path.join(__dirname, '../database/prompts.json.bak');

async function setup() {
  // Backup existing DB
  try {
    await fs.copyFile(dbPath, originalDbPath);
  } catch (e) {
    // If it doesn't exist, create an empty one
    await fs.writeFile(dbPath, '[]', 'utf-8');
  }

  // Clear DB
  await writePrompts([]);
}

async function teardown() {
  // Restore original DB
  try {
    await fs.access(originalDbPath); // check if backup exists
    await fs.copyFile(originalDbPath, dbPath);
    await fs.unlink(originalDbPath);
  } catch (e) {
    // Backup doesn't exist. Delete the test file to restore original state (missing file).
    try {
        await fs.unlink(dbPath);
    } catch (e2) {}
  }
}

async function runVerification() {
  await setup();

  try {
    console.log('Starting verification...');

    // Test 1: Read empty
    let prompts = await readPrompts();
    assert.deepStrictEqual(prompts, [], 'Initial prompts should be empty');
    console.log('Test 1 Passed: Read empty');

    // Test 2: Write and Read
    const testPrompt = { id: '1', title: 'Test', content: 'Content' };
    await writePrompts([testPrompt]);
    prompts = await readPrompts();
    assert.deepStrictEqual(prompts, [testPrompt], 'Should return the written prompt');
    console.log('Test 2 Passed: Write and Read');

    // Test 3: Persistence (simulate restart by clearing cache if implemented, or just verify file content)
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const filePrompts = JSON.parse(fileContent);
    assert.deepStrictEqual(filePrompts, [testPrompt], 'File on disk should match written data');
    console.log('Test 3 Passed: Persistence to disk');

    // Test 4: Update
    const updatedPrompt = { ...testPrompt, title: 'Updated' };
    await writePrompts([updatedPrompt]);
    prompts = await readPrompts();
    assert.deepStrictEqual(prompts, [updatedPrompt], 'Should return the updated prompt');
    console.log('Test 4 Passed: Update');

    console.log('All verification tests passed!');
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  } finally {
    await teardown();
  }
}

runVerification();
