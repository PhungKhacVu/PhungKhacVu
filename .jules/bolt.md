
## 2024-05-18 - [Add In-Memory Cache for database reads]
**Learning:** Found an opportunity to speed up consecutive file reads from the simple JSON "database". We can cache the file string directly in memory instead of reading it from the disk every request. This reduces file I/O operations and makes reading data instantaneous. To avoid cache poisoning, we just parse the cached string each time instead of caching the parsed object.
**Action:** Implement a file system cache directly in the database.js module.
