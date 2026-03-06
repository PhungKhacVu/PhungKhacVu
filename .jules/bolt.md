## 2024-03-06 - In-memory JSON Cache
**Learning:** The previous implementation read from and parsed the `database/prompts.json` file on every single API request, creating a severe bottleneck under concurrent loads due to excessive disk I/O.
**Action:** Implemented an in-memory stringified cache. Using stringified JSON instead of object references acts as a deep copy on parse, preventing cache poisoning from request handlers that modify returned objects. Cache is safely validated before setting and only updated after successful disk writes.
