# Change: Improve Code Quality and Best Practices

## Why
The embeddings-demo project has several code quality issues that don't follow best practices:

1. **Large bundle size warning:** The production build has a 584 KB chunk that exceeds recommended size limits
2. **Console.error in production code:** `tsne/index.jsx:136` has a console.error that should be removed or handled better
3. **Incomplete package.json scripts:** Missing `dev` script (README references it), incorrect lint script
4. **Empty demos directory:** `src/components/pages/demos/` exists but is empty (unused directory)
5. **Outdated dependencies:** 18 packages have updates available

While the app works, these issues indicate technical debt and potential production problems.

## What Changes
- **Bundle optimization:** Configure code splitting for MUI and LangChain libraries
- **Remove development logging:** Replace console.error with proper error handling UI
- **Fix package.json scripts:**
  - Add `dev` script to match README documentation
  - Fix `lint` script to properly target source files
- **Clean up unused code:** Remove empty `demos` directory
- **Update dependencies:** Upgrade to latest compatible versions for security and performance
- **Add build optimization:** Configure Vite rollup options for better chunking

## Impact
- **Affected files:**
  - `demos/embeddings-demo/vite.config.js` (add chunk splitting)
  - `demos/embeddings-demo/package.json` (fix scripts, update deps)
  - `demos/embeddings-demo/src/components/pages/tsne/index.jsx` (remove console.error)
  - `demos/embeddings-demo/src/components/pages/demos/` (delete directory)
- **Breaking changes:** None (internal improvements only)
- **Benefits:**
  - Faster initial page load (code splitting)
  - Better production error handling
  - Consistent development commands
  - Cleaner codebase
  - Latest security patches
  - Smaller bundle size
