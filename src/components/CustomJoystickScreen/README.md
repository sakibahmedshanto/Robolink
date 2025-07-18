# Custom Joystick Screen Components

This directory contains the modular components for the Custom Joystick Screen, following industry best practices for React Native development.

## Architecture

The CustomJoystickScreen has been split into multiple smaller, focused components for better maintainability, reusability, and testability.

## Components

### Core Components

- **`Header.tsx`** - Header with layout name and Edit/Add buttons
- **`SettingsPanel.tsx`** - Settings panel with save layout button (shown in edit mode)
- **`Canvas.tsx`** - Main canvas area where joystick buttons are rendered
- **`AnimatedButton.tsx`** - Individual draggable button component with gesture handling
- **`SavedLayouts.tsx`** - Horizontal scrollable list of saved layouts
- **`ButtonConfigModal.tsx`** - Modal for adding/editing button configurations
- **`SaveLayoutModal.tsx`** - Modal for saving layouts with custom names

### Utility Files

- **`types.ts`** - TypeScript type definitions
- **`constants.ts`** - Constants and configuration values
- **`utils.ts`** - Utility functions for layout management
- **`storage.ts`** - AsyncStorage operations for persistence
- **`index.ts`** - Barrel export for all components

## Features

### Modular Design
- Each component has a single responsibility
- Components are reusable and testable
- Clear separation of concerns
- Proper TypeScript typing throughout

### State Management
- Uses React hooks for state management
- Proper state lifting and prop drilling
- Centralized layout state management

### Error Handling
- Comprehensive error handling for storage operations
- User-friendly error messages
- Graceful fallbacks for failed operations

### Performance
- Optimized re-rendering with proper dependency arrays
- Efficient storage operations
- Smooth animations with React Native Reanimated

## Usage

```typescript
import CustomJoystickScreen from '../screens/CustomJoystickScreen';

// The main component automatically imports and uses all sub-components
<CustomJoystickScreen />
```

## Component Props

Each component has well-defined props interfaces for type safety:

```typescript
interface HeaderProps {
  currentLayoutName: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onAddButton: () => void;
}
```

## Storage

The app uses AsyncStorage for persisting:
- Current layout configuration
- Saved custom layouts
- Button configurations

## Dependencies

- React Native Gesture Handler (for drag interactions)
- React Native Reanimated (for smooth animations)
- AsyncStorage (for data persistence)
- React Native Picker (for dropdown selections)

## Best Practices Followed

1. **Component Composition** - Small, focused components
2. **TypeScript** - Full type safety throughout
3. **Error Handling** - Comprehensive error management
4. **Documentation** - Detailed comments and JSDoc
5. **Naming Conventions** - Clear, descriptive names
6. **Performance** - Optimized rendering and state updates
7. **Accessibility** - Proper component structure
8. **Testing Ready** - Components are easily testable

## Future Enhancements

- Add unit tests for each component
- Implement component-level error boundaries
- Add accessibility features
- Implement theme support
- Add animation presets
