---
name: Mirror Draw — gesture & event handling
description: How drawing works in mirror.tsx on native and web, and why PanResponder doesn't work.
---

## The rule

`GestureHandlerRootView` (wrapping the whole app) silently intercepts ALL `PanResponder` events on native (iOS/Android). Any game that uses `PanResponder` for drawing/dragging will receive zero events.

**Fix on native:** Use `Gesture.Pan()` from `react-native-gesture-handler` wrapped in `GestureDetector`.

**Fix on web:** Attach raw DOM `mousedown`/`mousemove` event listeners via `useEffect` to the underlying canvas `View` ref, which on React Native Web IS the DOM element directly (`canvasViewRef.current as unknown as HTMLElement`). Do NOT use `findNodeHandle` — it throws on web.

## Why

`GestureHandlerRootView` uses a native gesture recognizer system (UIGestureRecognizer on iOS, equivalent on Android) that pre-empts React Native's responder system. `Gesture.Pan()` participates in the same system, so it works.

On web, `GestureDetector`'s `Gesture.Pan()` uses PointerEvents API, but in the Replit proxied Expo web build, the gesture recognizer doesn't reliably respond to Playwright-simulated events. The direct DOM `addEventListener` approach works in both real browsers and Playwright.

## How to apply

```tsx
// Native
const panGesture = useRef(
  Gesture.Pan().runOnJS(true).minDistance(0)
    .onBegin((e) => startStrokeRef.current(e.x, e.y))
    .onUpdate((e) => extendStrokeRef.current(e.x, e.y))
).current;

// Web — attach in useEffect
useEffect(() => {
  if (Platform.OS !== 'web') return;
  const domEl = canvasViewRef.current as unknown as HTMLElement | null;
  if (!domEl?.addEventListener) return;
  const onMouseDown = (e: MouseEvent) => { ... domEl.getBoundingClientRect() ... };
  const onMouseMove = (e: MouseEvent) => { if (!e.buttons) return; ... };
  domEl.addEventListener('mousedown', onMouseDown);
  domEl.addEventListener('mousemove', onMouseMove);
  return () => { domEl.removeEventListener(...); };
}, []);
```

## SVG dimensions on web

`<Svg style={StyleSheet.absoluteFill}>` — style-based dimensions don't always establish the coordinate system on web. Always add `width="100%" height="100%"` props explicitly so path coordinates map 1:1 with pixels.

## Coordinates

- `e.x, e.y` from `Gesture.Pan()` are canvas-local (relative to the GestureDetector's wrapped View) — correct for native.
- `e.clientX - rect.left, e.clientY - rect.top` with `getBoundingClientRect()` gives canvas-local coords on web — correct.
- Mirror centre is simply `(canvasWidth/2, canvasHeight/2)` tracked via `onLayout`.
