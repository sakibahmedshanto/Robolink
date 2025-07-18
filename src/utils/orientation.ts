/**
 * Orientation helper for React Native
 * Provides orientation utilities and landscape enforcement
 */

import { Dimensions } from 'react-native';

/**
 * Checks if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

/**
 * Gets landscape dimensions (ensures width > height)
 */
export const getLandscapeDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width: Math.max(width, height),
    height: Math.min(width, height),
  };
};

/**
 * Gets the current orientation
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  return isLandscape() ? 'landscape' : 'portrait';
};

/**
 * Forces landscape orientation for the gamepad screen
 * This is implemented through manifest/plist configuration
 */
export const enforceLandscape = () => {
  // Note: Landscape orientation is enforced through:
  // - Android: android:screenOrientation="landscape" in AndroidManifest.xml
  // - iOS: UISupportedInterfaceOrientations in Info.plist
  console.log('Landscape orientation enforced through platform configuration');
};

/**
 * Gets gamepad-optimized dimensions
 */
export const getGamepadDimensions = () => {
  const { width, height } = getLandscapeDimensions();
  return {
    width,
    height,
    isLandscape: true,
  };
};
