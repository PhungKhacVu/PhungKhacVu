## 2026-04-20 - Debouncing Search Input
**Learning:** Attaching DOM-heavy rendering functions directly to raw input events causes synchronous main thread blocking on every keystroke, leading to janky UI updates.
**Action:** Always implement debouncing on search/filter inputs that trigger DOM re-renders or API calls to batch operations and keep the main thread unblocked.
