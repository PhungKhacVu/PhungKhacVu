## 2024-07-08 - Initialized\n**Learning:** Started Bolt journal.\n**Action:** Log critical findings here.
## 2024-07-08 - Frontend N+1 Bottleneck
**Learning:** Found massive N+1 HTTP request bottleneck during bulk file imports caused by fetching the entire prompt list via API after saving every individual prompt.
**Action:** Replaced expensive API re-fetches with targeted local state updates in JS memory, preserving rendering performance by skipping individual component re-renders during bulk operations.
