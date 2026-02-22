const { readPrompts } = require('../database');

async function runBenchmark() {
  console.log('Starting benchmark...');
  const start = process.hrtime();
  for (let i = 0; i < 1000; i++) {
    await readPrompts();
  }
  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(3);
  console.log(`1000 reads took ${timeInMs}ms`);
}

runBenchmark();
