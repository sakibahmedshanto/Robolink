/**
 * Utility functions for the Custom Joystick Screen
 * Helper functions for layout management and button operations
 */

import { Dimensions } from 'react-native';
import { JoystickButton, ButtonConfig } from './types';
import { DEFAULT_BUTTON_CONFIG } from './constants';

const screen = Dimensions.get('window');

/**
 * Creates a default layout with joystick and action buttons
 */
export const createDefaultLayout = (): JoystickButton[] => {
  return [
    {
      id: '1',
      type: 'joystick',
      label: 'Movement',
      x: 80.50,
      y: screen.height - 200.25,
      size: 80,
      color: '#2563eb',
      config: { sensitivity: 50 }
    },
    {
      id: '2',
      type: 'action',
      label: 'Fire',
      x: screen.width - 120.75,
      y: screen.height - 200.25,
      size: 60,
      color: '#dc2626',
      config: { action: 'fire' }
    },
    {
      id: '3',
      type: 'toggle',
      label: 'Lights',
      x: screen.width - 120.75,
      y: screen.height - 120.50,
      size: 50,
      color: '#f59e0b',
      config: { action: 'lights' }
    },
  ];
};

/**
 * Creates a new button with default positioning
 */
export const createNewButton = (
  type: string,
  label: string,
  config: ButtonConfig
): JoystickButton => {
  return {
    id: Date.now().toString(),
    type,
    label,
    x: parseFloat((screen.width / 2 - 40).toFixed(2)),
    y: parseFloat((screen.height / 2).toFixed(2)),
    size: config.size,
    color: config.color,
    config: {
      direction: config.direction,
      action: config.action,
      sensitivity: config.sensitivity,
      customCommand: config.customCommand,
    },
  };
};

/**
 * Updates a button's position with rounded values
 */
export const updateButtonPosition = (
  layout: JoystickButton[],
  buttonId: string,
  x: number,
  y: number
): JoystickButton[] => {
  const finalX = parseFloat(x.toFixed(2));
  const finalY = parseFloat(y.toFixed(2));

  return layout.map(item =>
    item.id === buttonId ? { ...item, x: finalX, y: finalY } : item
  );
};

/**
 * Updates a button's configuration
 */
export const updateButtonConfig = (
  layout: JoystickButton[],
  buttonIndex: number,
  label: string,
  type: string,
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
        config: {
          direction: config.direction,
          action: config.action,
          sensitivity: config.sensitivity,
          customCommand: config.customCommand,
        },
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
      ? { ...layoutItem, config: { ...layoutItem.config, sensitivity: value } }
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
    direction: button.config?.direction || DEFAULT_BUTTON_CONFIG.direction,
    action: button.config?.action || DEFAULT_BUTTON_CONFIG.action,
    size: button.size || DEFAULT_BUTTON_CONFIG.size,
    color: button.color || DEFAULT_BUTTON_CONFIG.color,
    sensitivity: button.config?.sensitivity || DEFAULT_BUTTON_CONFIG.sensitivity,
    customCommand: button.config?.customCommand || DEFAULT_BUTTON_CONFIG.customCommand,
  };
};
