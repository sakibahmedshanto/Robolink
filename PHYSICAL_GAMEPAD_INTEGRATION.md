# Physical Gamepad Integration for Custom Joystick Screen

## Overview

The `updateInputs` function is the key function that gets called whenever a physical gamepad provides any input. This function has been successfully integrated into the CustomJoystickScreen to enable physical gamepad input handling.

## Key Function: `updateInputs`

```typescript
const updateInputs = (evt: { [key: string]: any }) => {
  setGamepadInputs(prev => ({ ...prev, ...evt }));
  // Your custom logic here
};
```

This function receives an event object (`evt`) containing all the gamepad input data.

## Event Object Structure

The `evt` parameter contains various gamepad inputs:

### Button Inputs (Key-Value pairs where value is 0 or 1)
- `'96'`: A button
- `'97'`: B button  
- `'98'`: C button
- `'99'`: X button
- `'100'`: Y button
- `'101'`: Z button
- `'102'`: L1 (Left shoulder)
- `'103'`: R1 (Right shoulder)
- `'104'`: L2 (Left trigger)
- `'105'`: R2 (Right trigger)
- `'106'`: Left thumbstick click
- `'107'`: Right thumbstick click
- `'108'`: Start button
- `'109'`: Select button
- `'110'`: Mode button

### Analog Inputs (Values from -1000 to 1000)
- `leftX`: Left joystick X-axis
- `leftY`: Left joystick Y-axis
- `rightX`: Right joystick X-axis
- `rightY`: Right joystick Y-axis
- `hatX`: D-pad X-axis (-1000 = left, 1000 = right)
- `hatY`: D-pad Y-axis (-1000 = up, 1000 = down)
- `leftTrigger`: Left trigger (0 to 1000)
- `rightTrigger`: Right trigger (0 to 1000)

## Implementation in CustomJoystickScreen

The function has been added to your `CustomJoystickScreen.tsx` with the following features:

### 1. Event Listeners Setup
```typescript
useEffect(() => {
  const subs = [
    GlobalKeyEvent.addKeyUpListener(updateInputs),
    GlobalKeyEvent.addKeyDownListener(updateInputs),
    GlobalKeyEvent.onJoystickMoveListener(updateInputs),
  ];

  return () => subs.forEach(sub => sub.remove());
}, []);
```

### 2. Visual Feedback
- Green indicator appears at bottom of screen when physical input is detected
- Shows which inputs are currently active
- Automatically disappears when no input is detected

### 3. State Management
```typescript
const [gamepadInputs, setGamepadInputs] = useState<{ [key: string]: any }>({});
const [lastPhysicalInput, setLastPhysicalInput] = useState<string>('');
```

## How to Use This for Your Custom UI

### Example 1: Map Physical Button to Virtual Button Action
```typescript
const updateInputs = (evt: { [key: string]: any }) => {
  setGamepadInputs(prev => ({ ...prev, ...evt }));
  
  // Map physical A button (keyCode 96) to virtual button press
  if (evt['96'] === 1) { // Physical A button pressed
    // Find virtual button and trigger its action
    const virtualButton = layout.find(button => button.id === 'action-a');
    if (virtualButton) {
      console.log('Virtual A button triggered by physical input');
      // Add your action logic here (e.g., send command, trigger animation)
    }
  }
};
```

### Example 2: Map Physical Joystick to Virtual Joystick
```typescript
if (evt.leftX !== undefined || evt.leftY !== undefined) {
  const leftX = evt.leftX || 0;
  const leftY = evt.leftY || 0;
  
  // Update virtual joystick position
  const virtualJoystick = layout.find(button => button.id === 'left-joystick');
  if (virtualJoystick) {
    // You can update the virtual joystick's visual position
    // or trigger movement commands based on the values
    console.log(`Virtual left joystick: X=${leftX}, Y=${leftY}`);
  }
}
```

### Example 3: Map Physical D-Pad to Virtual D-Pad
```typescript
if (evt.hatX !== undefined || evt.hatY !== undefined) {
  const hatX = evt.hatX || 0;
  const hatY = evt.hatY || 0;
  
  // Trigger virtual D-pad buttons
  if (hatX < -500) {
    // Left pressed
    const leftButton = layout.find(button => button.id === 'dpad-left');
    // Trigger left action
  }
  if (hatX > 500) {
    // Right pressed
    const rightButton = layout.find(button => button.id === 'dpad-right');
    // Trigger right action
  }
  if (hatY < -500) {
    // Up pressed
    const upButton = layout.find(button => button.id === 'dpad-up');
    // Trigger up action
  }
  if (hatY > 500) {
    // Down pressed
    const downButton = layout.find(button => button.id === 'dpad-down');
    // Trigger down action
  }
}
```

## Testing the Implementation

1. **Connect a Physical Gamepad**: Connect a compatible gamepad to your device
2. **Navigate to Custom Joystick Screen**: Open the custom joystick screen
3. **Press Gamepad Buttons**: Press any button or move joysticks on the physical gamepad
4. **Check Visual Feedback**: You should see a green indicator at the bottom showing which inputs are active
5. **Check Console Logs**: Look for console logs showing the input data

## Available Virtual Button IDs

Based on the gamepad layout, you can target these virtual buttons:
- `'left-joystick'`: Left analog stick
- `'right-joystick'`: Right analog stick
- `'dpad-up'`, `'dpad-down'`, `'dpad-left'`, `'dpad-right'`: D-pad buttons
- `'action-a'`, `'action-b'`, `'action-x'`, `'action-y'`: Action buttons
- `'horn'`: Horn button
- `'menu'`, `'back'`: Menu buttons

## Next Steps

1. **Uncomment Example Code**: In the `updateInputs` function, uncomment the example mappings you want to use
2. **Add Action Logic**: Implement the specific actions you want to trigger (send commands, update UI, etc.)
3. **Test Mappings**: Test each mapping to ensure physical inputs trigger the correct virtual actions
4. **Customize**: Modify the mappings to match your specific requirements

## Key Points to Remember

- The `updateInputs` function is called for **every** gamepad input event
- Button values are 0 (released) or 1 (pressed)
- Analog values range from -1000 to 1000
- The function receives the same data format as the GamepadViewer component
- You can access the current layout through the `layout` state variable
- Console logging is enabled for debugging

This implementation gives you full access to physical gamepad input while maintaining the custom virtual joystick functionality!
