# SplitResult Settle Up Button TODO - COMPLETED ✅

- [x] `isViewingSavedSplit = Boolean(state?.split)`
- [x] Settle Up hidden on saved split view (`{!isViewingSavedSplit && (...)}`)
- [x] Share button remains; space adjusts

**Logic**: Hide save button when viewing existing splits.

```
bun dev
```
- Create split: Both Share/Settle Up buttons.
- Splits → arrow: **Only Share button**.

Perfect UX. All previous fixes intact (normalization, matching).



