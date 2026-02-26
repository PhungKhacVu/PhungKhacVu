
const { readPrompts, writePrompts } = require('../database');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '../database/prompts.json');

async function verify() {
  console.log('Running verification...');

  // 1. Read initial state
  const initialPrompts = await readPrompts();
  console.log(`Initial prompts count: ${initialPrompts.length}`);

  // 2. Add a new prompt
  const newPrompt = {
    id: `test-${crypto.randomBytes(4).toString('hex')}`,
    content: "This is a test prompt."
  };
  const updatedPrompts = [...initialPrompts, newPrompt];

  await writePrompts(updatedPrompts);
  console.log('Added new prompt via writePrompts.');

  // 3. Read back using readPrompts (should be cached)
  const cachedPrompts = await readPrompts();
  const foundInCache = cachedPrompts.find(p => p.id === newPrompt.id);

  if (foundInCache) {
    console.log('✅ Verify Cache: New prompt found via readPrompts.');
  } else {
    console.error('❌ Verify Cache: New prompt NOT found via readPrompts.');
    process.exit(1);
  }

  // 4. Read directly from file (should be persisted)
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const filePrompts = JSON.parse(fileContent);
    const foundInFile = filePrompts.find(p => p.id === newPrompt.id);

    if (foundInFile) {
      console.log('✅ Verify Persistence: New prompt found in database/prompts.json.');
    } else {
      console.error('❌ Verify Persistence: New prompt NOT found in database/prompts.json.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Verify Persistence: Error reading file:', err);
    process.exit(1);
  }

  // 5. Cleanup
  const cleanedPrompts = cachedPrompts.filter(p => p.id !== newPrompt.id);
  await writePrompts(cleanedPrompts);
  console.log('Cleaned up test prompt.');

  console.log('Verification passed!');
}

verify();
