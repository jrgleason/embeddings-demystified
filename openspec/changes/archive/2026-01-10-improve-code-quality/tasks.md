# Implementation Tasks

## 1. Bundle Optimization
- [x] 1.1 Add `build.rollupOptions.output.manualChunks` to vite.config.js
- [x] 1.2 Split MUI components into separate chunk
- [x] 1.3 Split LangChain libraries into separate chunk
- [x] 1.4 Split react-router into separate chunk
- [x] 1.5 Verify build no longer shows chunk size warning

## 2. Remove Development Logging
- [x] 2.1 Remove console.error from tsne/index.jsx line 136
- [x] 2.2 Ensure error is still displayed in error state (Alert component)
- [x] 2.3 Verify error handling still works properly

## 3. Fix Package.json Scripts
- [x] 3.1 Add `"dev": "node server.mjs"` script
- [x] 3.2 Update `"lint": "eslint src/"` to target correct directory
- [x] 3.3 Verify both scripts work correctly

## 4. Clean Up Unused Code
- [x] 4.1 Remove empty `src/components/pages/demos/` directory
- [x] 4.2 Verify no imports reference this directory

## 5. Update Dependencies
- [x] 5.1 Run `npm update` to update to latest compatible versions
- [x] 5.2 Test all features still work after update
- [x] 5.3 Run build to ensure no breaking changes
- [x] 5.4 Commit updated package-lock.json

## 6. Validation
- [x] 6.1 Run `npm run build` and verify no chunk warnings
- [x] 6.2 Run `npm run lint` and verify zero errors
- [x] 6.3 Test all pages load correctly
- [x] 6.4 Verify production build works (serve from dist/)
- [x] 6.5 Check bundle size is reduced
