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
    return layouts ? JSON.parse(layouts) : [];
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
    return currentLayout ? JSON.parse(currentLayout) : null;
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
