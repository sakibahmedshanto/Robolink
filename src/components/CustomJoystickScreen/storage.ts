/**
 * Storage utilities for the Custom Joystick Screen
 * Handles AsyncStorage operations for layouts and configurations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { JoystickButton, SavedLayout } from './types';

const KEYS = {
  CUSTOM_LAYOUTS: 'customLayouts',
  CURRENT_LAYOUT: 'currentLayout',
};

/**
 * Loads saved layouts from AsyncStorage
 */
export const loadSavedLayouts = async (): Promise<SavedLayout[]> => {
  try {
    const layouts = await AsyncStorage.getItem(KEYS.CUSTOM_LAYOUTS);
    if (!layouts) return [];
    
    const parsedLayouts = JSON.parse(layouts);
    // Migrate old layouts to new format
    return parsedLayouts.map((layout: any) => ({
      ...layout,
      layout: migrateLayout(layout.layout)
    }));
  } catch (error) {
    console.error('Error loading layouts:', error);
    return [];
  }
};

/**
 * Saves layouts to AsyncStorage
 */
export const saveSavedLayouts = async (layouts: SavedLayout[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CUSTOM_LAYOUTS, JSON.stringify(layouts));
  } catch (error) {
    console.error('Error saving layouts:', error);
    throw error;
  }
};

/**
 * Loads current layout from AsyncStorage
 */
export const loadCurrentLayout = async (): Promise<JoystickButton[] | null> => {
  try {
    const currentLayout = await AsyncStorage.getItem(KEYS.CURRENT_LAYOUT);
    if (!currentLayout) return null;
    
    const parsedLayout = JSON.parse(currentLayout);
    // Migrate old layout to new format
    return migrateLayout(parsedLayout);
  } catch (error) {
    console.error('Error loading current layout:', error);
    return null;
  }
};

/**
 * Saves current layout to AsyncStorage
 */
export const saveCurrentLayout = async (layout: JoystickButton[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CURRENT_LAYOUT, JSON.stringify(layout));
  } catch (error) {
    console.error('Error saving current layout:', error);
    throw error;
  }
};

/**
 * Creates a new saved layout
 */
export const createSavedLayout = (name: string, layout: JoystickButton[]): SavedLayout => {
  return {
    id: Date.now().toString(),
    name,
    layout,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Migrates old button configuration to new mapName/mapValue structure
 */
const migrateButton = (button: any): JoystickButton => {
  // If it's already in the new format, return as is
  if (button.mapName && button.mapValue !== undefined) {
    return button as JoystickButton;
  }
  
  // Convert old config structure to new structure
  let mapName = 'unknown';
  let mapValue = 100;
  
  if (button.config) {
    // Handle direction buttons
    if (button.type === 'direction' && button.config.direction) {
      mapName = button.config.direction;
    }
    // Handle action buttons
    else if (button.type === 'action' && button.config.action) {
      mapName = button.config.action;
    }
    // Handle slider buttons
    else if (button.type === 'slider' && button.config.sensitivity) {
      mapName = 'speed'; // Default slider mapping
      mapValue = button.config.sensitivity * 10; // Scale to 0-1000 range
    }
    // Handle toggle buttons (convert to action)
    else if (button.type === 'toggle' && button.config.action) {
      mapName = button.config.action;
      button.type = 'action'; // Convert toggle to action
    }
    // Handle joystick buttons (convert to slider)
    else if (button.type === 'joystick') {
      mapName = 'joystick';
      mapValue = 500; // Middle range
      button.type = 'slider'; // Convert to slider for simplicity
    }
  }
  
  // Ensure button type is one of the allowed types
  if (!['direction', 'action', 'slider'].includes(button.type)) {
    button.type = 'action';
  }
  
  return {
    id: button.id,
    type: button.type as 'direction' | 'action' | 'slider',
    label: button.label,
    x: button.x,
    y: button.y,
    size: button.size,
    color: button.color,
    mapName,
    mapValue,
  };
};

/**
 * Migrates layout array from old to new format
 */
const migrateLayout = (layout: any[]): JoystickButton[] => {
  return layout.map(migrateButton);
};
