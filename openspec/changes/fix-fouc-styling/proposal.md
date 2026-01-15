# Change: Fix Flash of Unstyled Content (FOUC)

## Why
The embeddings-demo currently exhibits a Flash of Unstyled Content (FOUC) where text and components render before styles are applied. Users see:

1. **Initial render**: Unstyled text appears with default browser styling
2. **Brief moment**: Text is in wrong position/styling
3. **Styles load**: CSS applies and text jumps to correct position
4. **Final state**: Properly styled interface

This creates a jarring, unprofessional user experience that makes the application feel slow and unpolished. It's especially noticeable on:
- Initial page load
- Route transitions
- Theme changes (light/dark mode toggle)

**Root Causes:**
- Tailwind CSS and MUI styles loading asynchronously
- No loading state while CSS is being processed
- React renders immediately without waiting for styles
- Vite CSS injection happens after initial render

This is a common issue with CSS-in-JS and utility-first CSS frameworks, but can be mitigated with proper loading states.

## What Changes
- Add a global loading overlay that hides content until styles are ready
- Implement CSS preload detection to know when styles are applied
- Add smooth fade-in transition once styles are loaded
- Include loading spinner/skeleton during initialization
- Ensure theme changes don't cause FOUC
- Add CSS critical path optimization in Vite config

**Technical Approach:**
1. Create `LoadingOverlay` component with spinner
2. Add CSS loading detection in main.jsx
3. Use `document.fonts.ready` and style detection to determine readiness
4. Fade out overlay with smooth transition
5. Optionally add skeleton screens for perceived performance

## Impact
- **Affected files:**
  - `demos/embeddings-demo/src/main.jsx` (add loading detection)
  - `demos/embeddings-demo/src/components/LoadingOverlay.jsx` (new component)
  - `demos/embeddings-demo/src/Root.jsx` (wrap with loading state)
  - `demos/embeddings-demo/vite.config.js` (CSS optimization)
  - `demos/embeddings-demo/index.html` (add initial loading state)
- **Breaking changes:** None (visual enhancement only)
- **Benefits:**
  - Professional, polished user experience
  - No jarring layout shifts
  - Perceived faster loading (smooth transitions)
  - Better first impression
  - Accessibility improvement (no content jumping for screen readers)
