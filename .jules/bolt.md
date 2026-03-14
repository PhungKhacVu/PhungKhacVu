## 2024-05-18 - In-Memory Cache Optimization for JSON Database
**Learning:** For a single-process application using a JSON file as a local database, reading the file on every API call is a significant bottleneck (1000 reads took ~1130ms).
**Action:** Implemented an in-memory cache (`cachedPromptsString`) in `database.js` that acts as a deep copy via `JSON.parse()`. This drastically improved read performance (1000 reads took ~106ms). Ensure cache invalidation and concurrency races are handled properly to maintain consistency across reads and writes.
