# Gesture Implementation with react-native-gesture-handler

## Overview

The CustomJoystickScreen has been successfully upgraded to use `react-native-gesture-handler` and `react-native-reanimated` for smooth, precise, and reliable drag-and-drop functionality.

## Key Features

### 1. Modern Gesture Handling
- **react-native-gesture-handler**: Provides native-level gesture recognition
- **react-native-reanimated**: Ensures smooth animations and precise position updates
- **No more legacy Draggable**: Removed the old `react-native-draggable` dependency

### 2. Precise Float Positioning
- Button positions are stored as precise floats (e.g., `x: 80.50, y: 200.25`)
- Grid snapping is **disabled by default** for smooth, free-form movement
- When grid snapping is enabled, positions are rounded to the nearest grid point
- Positions are stored with 2-decimal precision for consistency

### 3. Smooth Drag Experience
- Uses `Pan` gesture with proper `onStart`, `onUpdate`, and `onEnd` handlers
- Tracks translation from the initial position rather than absolute coordinates
- No jumps or lag during fast drags
- Instant visual feedback during dragging

### 4. Edit Mode Integration
- Gestures are only enabled when `isEditMode` is `true`
- Edit and delete controls appear only in edit mode
- Smooth transitions between edit and view modes

## Technical Implementation

### AnimatedButton Component
```tsx
const AnimatedButton = ({ item, index }) => {
  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);
  const startPosition = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .enabled(isEditMode)
    .onStart(() => {
      startPosition.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = startPosition.value.x + event.translationX;
      translateY.value = startPosition.value.y + event.translationY;
    })
    .onEnd(() => {
      const finalX = snapToGrid(translateX.value);
      const finalY = snapToGrid(translateY.value);
      
      translateX.value = finalX;
      translateY.value = finalY;
      
      runOnJS(updateButtonPosition)(item.id, finalX, finalY);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, { position: 'absolute' }]}>
        {/* Button content */}
      </Animated.View>
    </GestureDetector>
  );
};
```

### Position Management
- `snapToGrid()` function respects the grid snap setting
- When grid snap is disabled, returns precise float values
- Position updates are batched using `runOnJS()` for performance
- Layout state is automatically saved to AsyncStorage

## Setup Requirements

### 1. App Wrapper
The app is wrapped with `GestureHandlerRootView`:
```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Navigation />
  </GestureHandlerRootView>
);
```

### 2. Dependencies
```json
{
  "react-native-gesture-handler": "^2.x.x",
  "react-native-reanimated": "^3.x.x"
}
```

## User Experience Improvements

### Before (Legacy Draggable)
- Jumpy movement during fast drags
- Grid-locked positioning only
- Potential performance issues with complex layouts
- Limited customization options

### After (Gesture Handler)
- Smooth, native-feeling drag experience
- Precise float positioning with optional grid snapping
- Excellent performance even with many buttons
- Full control over gesture behavior and animations

## Configuration Options

### Grid Settings
- **Grid Snap**: Toggle between free-form and grid-aligned positioning
- **Grid Size**: Choose from 10px, 20px, or 30px grid sizes
- **Precision**: All positions stored with 2-decimal float precision

### Button Properties
- **Position**: Stored as `{ x: number, y: number }` with float precision
- **Size**: Configurable size affects both visual appearance and drag area
- **Color**: Visual customization doesn't affect gesture handling

## Performance

- Gestures run on the UI thread for maximum responsiveness
- Shared values update without triggering React re-renders during drag
- Layout updates are batched and occur only on drag end
- Minimal memory footprint with efficient event handling

## Future Enhancements

Potential improvements that could be added:
- **Bounds checking**: Prevent buttons from being dragged outside the canvas
- **Multi-touch**: Support for multi-finger gestures
- **Inertia**: Momentum-based movement after release
- **Magnetic snapping**: Attract to grid points when nearby
- **Gesture combinations**: Double-tap to edit, long-press for context menu
