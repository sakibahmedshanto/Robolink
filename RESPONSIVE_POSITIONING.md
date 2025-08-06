# Responsive Positioning System

## Overview

The Custom Joystick Screen now uses a completely responsive positioning system that adapts to different screen sizes and orientations. All hardcoded pixel values have been replaced with percentage-based positioning and responsive button sizes.

## Key Features

### 1. **Responsive Screen Bounds**
- **Dynamic screen detection** - Automatically detects current screen dimensions and orientation
- **Safe zones** - Calculates usable area excluding headers, status bars, and padding
- **Layout zones** - Predefined zones for different types of controls (left, right, center, top, bottom)

### 2. **Responsive Button Sizing**
- **Three size types**: `small`, `medium`, `large`
- **Automatic scaling** based on screen dimensions
- **Configurable limits** - Min/max sizes to ensure usability across devices
- **Manual override** - Custom pixel sizes still supported

### 3. **Percentage-Based Positioning**
- All button positions use **0-1 percentage coordinates** relative to usable screen area
- **Cross-device compatibility** - Same layout proportions on different screen sizes
- **Orientation handling** - Automatically adapts to landscape/portrait changes

## Configuration

### Layout Configuration (`LAYOUT_CONFIG`)
```typescript
{
  header: {
    heightPercent: 0.08,    // Header takes 8% of screen height
    minHeight: 50,          // Minimum 50px
    maxHeight: 80,          // Maximum 80px
  },
  safeZone: {
    paddingPercent: 0.02,   // 2% padding from edges
    minPadding: 10,         // Minimum 10px
    maxPadding: 30,         // Maximum 30px
  },
  buttons: {
    smallSizePercent: 0.08,   // Small buttons: 8% of screen width
    mediumSizePercent: 0.12,  // Medium buttons: 12% of screen width
    largeSizePercent: 0.18,   // Large buttons: 18% of screen width
    minSize: 40,              // Minimum 40px
    maxSize: 120,             // Maximum 120px
  }
}
```

## Button Positioning Examples

### Percentage-Based Layout
```typescript
// Left joystick - bottom left area
createButton('left-joystick', 'joystick', '', 0.15, 0.75, 'large', '#FFD700', {});

// Right action buttons - right side
createButton('action-a', 'action', 'A', 0.88, 0.55, 'medium', '#16a34a', {});

// Top shoulder buttons
createButton('shoulder-l1', 'action', 'L1', 0.15, 0.05, 'small', '#6b7280', {});
```

### Layout Zones
```typescript
const zones = getLayoutZones();

// leftZone: Left 40% of screen for movement controls
// rightZone: Right 40% of screen for action controls  
// centerZone: Center 40% of screen for utility controls
// topZone: Top 20% of screen for shoulder buttons
// bottomZone: Bottom 60% of screen for main controls
```

## New API Functions

### Screen Utilities
- `getCurrentScreen()` - Get current screen dimensions with orientation handling
- `getUsableScreenDimensions()` - Get usable area excluding header/padding
- `getLayoutZones()` - Get predefined layout zones

### Positioning
- `getPositionFromPercent(x%, y%)` - Convert percentage to pixel coordinates
- `getPercentFromPosition(x, y)` - Convert pixel coordinates to percentages
- `getSafeDefaultPosition(size)` - Get safe center position for new buttons

### Responsive Sizing
- `getButtonSize('small'|'medium'|'large')` - Get responsive button size
- `getHeaderHeight()` - Get responsive header height

### Constraints
- `constrainToScreenBounds(x, y, size)` - Ensure button stays within bounds (only restricts header overlap)
- `constrainToScreenBoundsWorklet(x, y, size)` - Worklet version for gesture handlers

## Button Configuration

### New Size Options
Buttons now support both responsive and manual sizing:

- **Responsive**: Choose from `small`, `medium`, `large` size types
- **Manual**: Set custom pixel size (30-120px range)
- **Dynamic**: Size automatically calculated based on screen dimensions

### Updated ButtonConfig Interface
```typescript
interface ButtonConfig {
  direction: string;
  action: string;
  size: number;                    // Calculated pixel size
  sizeType?: 'small' | 'medium' | 'large';  // Responsive size type
  color: string;
  sensitivity: number;
  customCommand: string;
}
```

## Migration Notes

### From Fixed to Responsive
- **Old**: Fixed pixel coordinates (x: 450, y: 200)
- **New**: Percentage coordinates (xPercent: 0.5, yPercent: 0.3)

### Existing Layouts
- Existing saved layouts are **automatically migrated**
- Positions are **constrained to safe bounds** on load
- **No user action required** for migration

## Benefits

1. **Cross-Device Compatibility** - Works on phones, tablets, different aspect ratios
2. **Orientation Support** - Adapts to landscape/portrait changes
3. **Accessibility** - Ensures buttons are always reachable and sized appropriately  
4. **Future-Proof** - Easy to adjust for new screen sizes and devices
5. **Professional Layout** - Consistent proportions across all devices

## Technical Implementation

The responsive system is built using:
- **React Native Dimensions API** for screen detection
- **Percentage-based calculations** for positioning
- **Constraint functions** to ensure buttons stay within bounds
- **Worklet-compatible functions** for smooth gesture handling
- **Automatic orientation detection** and handling

All positioning is now relative to the usable screen area, ensuring that buttons are never hidden behind system UI elements and always remain accessible to users.
