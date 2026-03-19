
## 2024-05-15 - In-Memory Caching for High-Frequency Disk Reads
**Learning:** The `database.js` module performed synchronous-like file system reads via `fs.readFile` on every incoming API request for `/api/prompts`. This created a massive disk I/O bottleneck when request frequency increased. Caching the raw JSON string in memory and parsing it on demand via `JSON.parse()` acts as a deep copy, preventing cache poisoning from in-memory mutations while eliminating redundant disk reads.
**Action:** Always consider an in-memory stringified cache for local JSON file databases. Update the stringified cache only upon successful disk writes.
