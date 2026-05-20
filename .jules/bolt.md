## 2026-05-20 - Optimize State Updates
**Learning:** Re-fetching all data on every mutation causes N+1 bottlenecks and slow UI.
**Action:** Use local state upserts (optimistic updates) instead.
