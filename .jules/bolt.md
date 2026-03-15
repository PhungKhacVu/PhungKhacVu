## 2024-05-24 - File Reading Cache
**Learning:** The database was constantly reading from disk via `fs.readFile` on every API call (GET, POST, PUT, DELETE). Since the server manages state, we can cache this in memory and only read from disk on the very first start, or when necessary.
**Action:** Implemented an in-memory cache (`cachedPromptsString`) in `database.js` to eliminate disk I/O for reads, with care taken to avoid cache poisoning by parsing from a string.
