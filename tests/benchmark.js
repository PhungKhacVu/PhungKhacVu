const { readPrompts, writePrompts } = require('../database');
const fs = require('fs/promises');
const path = require('path');

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

  // Populate DB with some data
  const initialData = Array.from({ length: 100 }, (_, i) => ({
    id: `prompt-${i}`,
    title: `Prompt ${i}`,
    content: `This is the content for prompt ${i}`,
    tags: ['test', 'benchmark']
  }));
  await writePrompts(initialData);
}

async function teardown() {
  // Restore original DB
  try {
    await fs.copyFile(originalDbPath, dbPath);
    await fs.unlink(originalDbPath);
  } catch (e) {
    // If backup didn't exist, just delete the test DB
    // await fs.unlink(dbPath); // Actually, keep it for manual inspection if needed
  }
}

async function runBenchmark() {
  await setup();

  const iterations = 1000;
  const startTime = process.hrtime();

  for (let i = 0; i < iterations; i++) {
    await readPrompts();
  }

  const endTime = process.hrtime(startTime);
  const durationInMs = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);

  console.log(`Read ${iterations} times in ${durationInMs}ms`);
  console.log(`Average read time: ${(durationInMs / iterations).toFixed(4)}ms`);

  await teardown();
}

runBenchmark().catch(console.error);
