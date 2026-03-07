## 2024-05-15 - [Database read caching]
 **Learning:** Disk I/O was a bottleneck on every API read. We can cache the file string in memory. To avoid cache poisoning where callers mutate the returned array, we store the stringified JSON and call JSON.parse() on it each time. This acts as a fast deep copy.
 **Action:** When caching object state that is returned to callers, always ensure you return a copy to prevent accidental mutation of the cache.
