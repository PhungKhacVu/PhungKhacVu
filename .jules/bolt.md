## 2024-04-02 - UI Testing Data Pollution
**Learning:** Running local Playwright UI tests that perform write operations (POST, DELETE) against the live JSON development database (`database/prompts.json`) leaves permanent artifact modifications that get tracked by git.
**Action:** Always verify `git status` and revert changes to `database/prompts.json` before finalizing commits when verifying frontend UI workflows.
