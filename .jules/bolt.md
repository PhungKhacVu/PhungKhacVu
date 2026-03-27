## 2024-05-24 - File I/O Bottleneck in Database Reads
**Learning:** `database.js` was reading from disk (`fs.readFile`) on every single API request. However, because Express route handlers might mutate the returned array, a simple in-memory cache reference could lead to cross-request data corruption.
**Action:** Implemented an in-memory cache using a deep copy (`JSON.parse(JSON.stringify())`) to eliminate disk I/O while preserving immutability across requests.
