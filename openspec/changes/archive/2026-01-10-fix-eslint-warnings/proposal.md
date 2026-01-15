# Change: Fix ESLint Fast Refresh Warnings

## Why
The embeddings-demo project has 2 ESLint errors related to react-refresh/only-export-components that prevent proper Fast Refresh functionality during development. Fast Refresh is a critical feature for React development that allows instant feedback when editing components without losing component state.

**Current Issues:**
1. `ThemeContext.jsx` exports both a hook (`useThemeMode`) and a component (`ThemeProvider`), violating Fast Refresh rules
2. `main.jsx` has no exports, making Fast Refresh unable to track component changes

These are not just warnings—they are actual errors that degrade the developer experience.

## What Changes
- Refactor `ThemeContext.jsx` to separate the hook export from the component export
- Move `AppWithTheme` component from `main.jsx` to a separate file
- Ensure all files follow React Fast Refresh best practices
- Update imports to reference new file locations

## Impact
- **Affected files:**
  - `demos/embeddings-demo/src/ThemeContext.jsx` (refactored)
  - `demos/embeddings-demo/src/main.jsx` (simplified)
  - `demos/embeddings-demo/src/App.jsx` (new file - extracted component)
- **Breaking changes:** None (internal refactoring only)
- **Benefits:**
  - Proper Fast Refresh during development
  - Cleaner separation of concerns
  - Better code organization following React best practices
  - Zero ESLint errors
