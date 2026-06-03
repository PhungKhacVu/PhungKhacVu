## 2024-05-24 - Avoid O(N) layout thrashing on selection change
**Learning:** Found a pattern where updating the active item selection triggers a full DOM recreation (`renderPromptList`) causing O(N) layout thrashing.
**Action:** Replace `renderPromptList()` on selection change with direct O(1) DOM manipulation by adding/removing the 'active' class on elements to improve frontend performance.