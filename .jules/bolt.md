
## 2024-05-19 - Avoid N+1 requests during bulk frontend operations
**Learning:** During bulk frontend operations like importing files, awaiting an API refetch (`fetchPrompts()`) after every single item save causes massive N+1 HTTP request bottlenecks.
**Action:** Use local state updates (e.g., mutating the local `allPrompts` array) instead of full list refetches after successful API mutations to maintain UI consistency and dramatically improve performance.
