const { readPrompts } = require('../database');

async function benchmark() {
  const start = Date.now();
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    await readPrompts();
  }
  const end = Date.now();
  const duration = end - start;
  console.log(`Benchmark: ${iterations} reads took ${duration}ms`);
  console.log(`Average: ${(duration / iterations).toFixed(3)}ms per read`);
}

benchmark();
