## 2026-04-30 - N+1 HTTP Request Bottleneck on Bulk Operations
**Learning:** Calling `fetchPrompts()` (which fetches the entire list of prompts) after every `savePrompt()` call causes a massive N+1 HTTP request bottleneck during bulk operations like importing files, as it iterates over the array and saves each prompt individually.
**Action:** Use local state updates instead of full refetches after mutations (like saving or deleting) to keep the UI in sync without unnecessary network overhead.
