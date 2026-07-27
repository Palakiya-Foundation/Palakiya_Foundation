# Site Content Admin Panel Sync Fixes

## Steps

- [x] 1. Create TODO.md with implementation plan
- [x] 2. Fix `ContentContext.jsx` — Make `refresh()` propagate errors to callers so they can handle failures properly
- [x] 3. Fix `ManageContent.jsx` — Add loading state, dirty tracking, and proper error handling:
       - Use `loading` from ContentContext to show skeleton while content loads
       - Track `initialized` state to prevent overwriting unsaved edits
       - Fix save flow to use API response directly + properly catch errors from refresh()
- [x] 4. Restart backend & frontend to verify the fix

