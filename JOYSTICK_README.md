# Custom Virtual Joystick System

This is a comprehensive virtual joystick system for React Native that allows users to create custom control layouts for bot/robot control.

## Features

### Button Types
1. **Circle Button** - Round action buttons (A, B, X, Y, etc.)
2. **Square Button** - Square action buttons 
3. **Directional Button** - Arrow-style directional controls
4. **Trigger Button** - Trigger-style buttons (LT, RT)
5. **Toggle Button** - Toggle switches that maintain state

### Joystick Components
1. **Analog Joystick** - Full 360-degree analog stick with customizable dead zone
2. **D-Pad** - 4-directional digital pad
3. **Virtual Buttons** - Customizable action buttons

### Layout Management
- **Save/Load Layouts** - Persistent custom layouts
- **Edit Mode** - Drag and drop components
- **Component Palette** - Easy component selection
- **Real-time Preview** - See changes as you make them

## Usage

### Creating a Custom Layout

1. **Enter Edit Mode**: Tap the "Edit" button in the header
2. **Add Components**: Tap "Add" to open the component palette
3. **Select Component Type**: Choose from buttons, joysticks, or D-pad
4. **Position Components**: Long press components to delete them
5. **Save Layout**: Tap "Save" to persist your custom layout

### Component Types

#### Buttons
- **Circle**: Standard round action buttons
- **Square**: Square action buttons  
- **Directional**: Arrow-style directional controls
- **Trigger**: Shoulder trigger buttons
- **Toggle**: Maintains on/off state

#### Joysticks
- **Analog Stick**: 360-degree movement with dead zone
- **Return to Center**: Automatically returns to neutral position
- **Customizable Range**: Adjustable sensitivity and range

#### D-Pad
- **4-Way Control**: Up, Down, Left, Right
- **Digital Input**: Discrete directional control
- **Visual Feedback**: Clear press indication

### Data Transmission

The system supports both Bluetooth and UDP transmission:

#### Bluetooth
- Connects to paired devices
- Configurable transmission interval
- Base64 encoded data format

#### UDP
- Network broadcast capability
- Configurable port and interval
- Real-time data streaming

#### Data Format
```
<[number_of_inputs] [value1] [value2] ... [valueN]>
```

Example: `<4 0 1 500 -750>` 
- 4 total inputs
- Input 1: 0 (button not pressed)
- Input 2: 1 (button pressed) 
- Input 3: 500 (joystick X axis)
- Input 4: -750 (joystick Y axis)

## File Structure

```
src/
├── components/
│   ├── VirtualButton.tsx      # Individual button component
│   ├── VirtualJoystick.tsx    # Analog joystick component
│   ├── VirtualDPad.tsx        # D-pad component
│   └── ComponentPalette.tsx   # Component selection interface
├── screens/
│   └── CustomJoystickScreen.tsx # Main joystick screen
├── types/
│   └── joystick.ts            # TypeScript definitions
└── utils/
    └── joystickUtils.ts       # Helper functions
```

## Integration

The custom joystick integrates with the existing gamepad system:
- Uses same data transmission methods
- Shares Bluetooth/UDP configuration
- Compatible with existing robot control protocols

## Customization

### Colors
- Default primary color: `#D72638`
- All components support custom colors
- Visual feedback for active/pressed states

### Positioning
- Free-form positioning on canvas
- Automatic boundary validation
- Grid-snap optional (future enhancement)

### Sensitivity
- Configurable joystick dead zones
- Adjustable transmission intervals
- Customizable component sizes

## Future Enhancements

1. **Component Resizing** - Drag handles for size adjustment
2. **Grid Snap** - Align components to grid
3. **Themes** - Pre-built color schemes
4. **Templates** - Pre-made layouts for common use cases
5. **Advanced Gestures** - Multi-touch support
6. **Component Linking** - Link multiple components together
7. **Macro Support** - Record and playback button sequences
