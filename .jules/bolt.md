## 2026-05-28 - Optimize Bulk Operations and API Calls
**Learning:** Relying on full list refetches (fetchPrompts) and triggering individual UI re-renders inside loops (savePrompt) creates severe N+1 bottlenecks during bulk imports.
**Action:** Update local state arrays directly and batch/skip UI re-renders during bulk operations to dramatically improve performance.
