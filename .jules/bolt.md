## 2024-05-28 - [In-Memory Cache Stringification]
**Learning:** [Using a raw object for in-memory caching can lead to cache poisoning if consumers mutate the returned object references. Storing the stringified JSON and calling `JSON.parse` on read provides a quick, native deep-copy mechanism.]
**Action:** [Use stringified cache values and parse them upon read requests instead of serving direct object references to safely avoid mutation issues in single-node applications.]
