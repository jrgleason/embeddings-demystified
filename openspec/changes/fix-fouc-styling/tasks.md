# Implementation Tasks

## 1. Create Loading Overlay Component
- [ ] 1.1 Create `src/components/LoadingOverlay.jsx`
- [ ] 1.2 Design loading spinner with MUI CircularProgress
- [ ] 1.3 Add smooth fade-out transition (CSS)
- [ ] 1.4 Ensure overlay covers entire viewport
- [ ] 1.5 Style with appropriate z-index to be on top

## 2. Implement CSS Loading Detection
- [ ] 2.1 Create utility function to detect when styles are loaded
- [ ] 2.2 Check `document.fonts.ready` promise
- [ ] 2.3 Detect Tailwind CSS classes are applied (test a known class)
- [ ] 2.4 Detect MUI theme is available
- [ ] 2.5 Combine all checks into single ready promise

## 3. Integrate Loading State
- [ ] 3.1 Add loading state to `src/main.jsx`
- [ ] 3.2 Render LoadingOverlay initially
- [ ] 3.3 Wait for CSS ready promise before hiding overlay
- [ ] 3.4 Add smooth fade-out transition (300-500ms)
- [ ] 3.5 Remove overlay from DOM after transition

## 4. Add Initial HTML Loading State
- [ ] 4.1 Update `index.html` to include inline loading spinner
- [ ] 4.2 Add inline critical CSS for loading spinner
- [ ] 4.3 Ensure spinner shows immediately (no dependency on external CSS)
- [ ] 4.4 React app removes HTML spinner when ready

## 5. Optimize CSS Loading
- [ ] 5.1 Update `vite.config.js` to inline critical CSS
- [ ] 5.2 Add CSS preload hints
- [ ] 5.3 Ensure CSS is processed before JavaScript execution
- [ ] 5.4 Configure build to minimize FOUC

## 6. Handle Theme Changes
- [ ] 6.1 Ensure theme toggle doesn't cause FOUC
- [ ] 6.2 Add brief transition state during theme change
- [ ] 6.3 Use CSS transitions for smooth theme switching
- [ ] 6.4 Test light/dark mode transitions

## 7. Testing
- [ ] 7.1 Test on fresh page load (hard refresh)
- [ ] 7.2 Test on slow 3G connection (throttle network)
- [ ] 7.3 Test route transitions
- [ ] 7.4 Test theme toggle transitions
- [ ] 7.5 Verify no content flash on any page
- [ ] 7.6 Test with cache disabled
- [ ] 7.7 Verify loading spinner appears immediately

## 8. Performance Validation
- [ ] 8.1 Ensure loading detection doesn't delay app startup
- [ ] 8.2 Verify smooth fade transitions (60fps)
- [ ] 8.3 Check Lighthouse performance score
- [ ] 8.4 Measure time-to-interactive
