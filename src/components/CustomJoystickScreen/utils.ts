/**
 * Utility functions for the Custom Joystick Screen
 * Helper functions for layout management and button operations
 */

import { JoystickButton, ButtonConfig } from './types';
import { DEFAULT_BUTTON_CONFIG, ALL_MAP_OPTIONS } from './constants';
import { getSafeDefaultPosition, constrainToScreenBounds } from './screenBounds';

/**
 * Creates a default layout with basic buttons
 */
export const createDefaultLayout = (): JoystickButton[] => {
  const defaultPosition = getSafeDefaultPosition(60);
  
  return [
    {
      id: '1',
      type: 'direction',
      label: 'Forward',
      x: defaultPosition.x - 100,
      y: defaultPosition.y,
      size: 60,
      color: '#2563eb',
      mapName: 'forward',
      mapValue: 100
    },
    {
      id: '2',
      type: 'action',
      label: 'Fire',
      x: defaultPosition.x + 100,
      y: defaultPosition.y,
      size: 60,
      color: '#dc2626',
      mapName: 'fire',
      mapValue: 100
    },
  ];
};

/**
 * Creates a new button with default positioning
 */
export const createNewButton = (
  type: 'direction' | 'action' | 'slider',
  label: string,
  config: ButtonConfig
): JoystickButton => {
  const safePosition = getSafeDefaultPosition(config.size);
  
  return {
    id: Date.now().toString(),
    type,
    label,
    x: parseFloat(safePosition.x.toFixed(2)),
    y: parseFloat(safePosition.y.toFixed(2)),
    size: config.size,
    color: config.color,
    mapName: config.mapName,
    mapValue: config.mapValue,
  };
};

/**
 * Updates a button's position with rounded values and bounds checking
 */
export const updateButtonPosition = (
  layout: JoystickButton[],
  buttonId: string,
  x: number,
  y: number
): JoystickButton[] => {
  return layout.map(item => {
    if (item.id === buttonId) {
      // Constrain to screen bounds
      const constrainedPos = constrainToScreenBounds(x, y, item.size);
      const finalX = parseFloat(constrainedPos.x.toFixed(2));
      const finalY = parseFloat(constrainedPos.y.toFixed(2));
      
      return { ...item, x: finalX, y: finalY };
    }
    return item;
  });
};

/**
 * Updates a button's configuration
 */
export const updateButtonConfig = (
  layout: JoystickButton[],
  buttonIndex: number,
  label: string,
  type: 'direction' | 'action' | 'slider',
  config: ButtonConfig
): JoystickButton[] => {
  return layout.map((item, index) => {
    if (index === buttonIndex) {
      return {
        ...item,
        label,
        type,
        size: config.size,
        color: config.color,
        mapName: config.mapName,
        mapValue: config.mapValue,
      };
    }
    return item;
  });
};

/**
 * Updates slider value for a specific button
 */
export const updateSliderValue = (
  layout: JoystickButton[],
  buttonId: string,
  value: number
): JoystickButton[] => {
  return layout.map(layoutItem =>
    layoutItem.id === buttonId
      ? { ...layoutItem, mapValue: Math.round(value) } // Update mapValue for sliders
      : layoutItem
  );
};

/**
 * Removes a button from the layout
 */
export const removeButton = (
  layout: JoystickButton[],
  buttonId: string
): JoystickButton[] => {
  return layout.filter(item => item.id !== buttonId);
};

/**
 * Gets button configuration from a layout item
 */
export const getButtonConfig = (button: JoystickButton): ButtonConfig => {
  return {
    mapName: button.mapName || getDefaultMapName(button.type),
    mapValue: button.mapValue || DEFAULT_BUTTON_CONFIG.mapValue,
    size: button.size || DEFAULT_BUTTON_CONFIG.size,
    color: button.color || DEFAULT_BUTTON_CONFIG.color,
  };
};

/**
 * Gets default map name for button type
 */
export const getDefaultMapName = (type: 'direction' | 'action' | 'slider'): string => {
  switch (type) {
    case 'direction':
      return 'forward_backward';
    case 'action':
      return 'fire';
    case 'slider':
      return 'speed';
    default:
      return 'unknown';
  }
};
