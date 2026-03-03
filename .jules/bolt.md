## 2024-05-24 - [Avoid disk I/O on every API request]
 **Learning:** The application reads the entire JSON database from disk for every single API operation (GET, POST, PUT, DELETE). This is a significant bottleneck as it performs synchronous-like disk I/O. Using an in-memory string cache avoids disk I/O and prevents cache poisoning via `JSON.parse`.
 **Action:** Implement an in-memory string cache in `database.js` that is updated only upon successful disk write.
