## 2024-05-24 - File I/O Bottleneck
**Learning:** The architecture reads from disk on every API request in `database.js`. Reading and parsing JSON on every request is a huge performance bottleneck.
**Action:** Implemented an in-memory stringified JSON cache in `database.js` to reduce disk reads to zero after initialization, improving latency.