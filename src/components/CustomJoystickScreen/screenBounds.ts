/**
 * Screen bounds utility functions for the Custom Joystick Screen
 * Ensures buttons stay within the visible screen area
 */

import { Dimensions, Platform, StatusBar } from 'react-native';

// Get screen dimensions
const screen = Dimensions.get('window');

// Header height (should match actual header component height)
const HEADER_HEIGHT = 10;

// Padding from screen edges
const SCREEN_PADDING = 10;

// Tuning parameters for safe bounds area
export const BOUNDS_TUNING = {
  x: 0,        // X offset for safe area position (positive = move right, negative = move left)
  y: 0,        // Y offset for safe area position (positive = move down, negative = move up)  
  size: 1.0    // Scale factor for safe area size (1.0 = full size, 0.8 = 80% of screen, etc.)
};

/**
 * Get the usable screen dimensions (excluding header and padding)
 */
export const getUsableScreenDimensions = () => {
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  
  // Get the actual available height (subtract status bar if not hidden)
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  
  // Ensure we're working with landscape dimensions
  const width = Math.max(screenWidth, screenHeight);
  const height = Math.min(screenWidth, screenHeight);
  
  // Calculate the base usable area (in immersive mode, we use full screen)
  const baseUsableWidth = width - (SCREEN_PADDING * 2);
  const baseUsableHeight = height - HEADER_HEIGHT - (SCREEN_PADDING * 2)-50 ;
  
  // Apply tuning parameters
  const tunedWidth = baseUsableWidth * BOUNDS_TUNING.size;
  const tunedHeight = baseUsableHeight * BOUNDS_TUNING.size;
  
  // Calculate the tuned center position
  const baseCenterX = width / 2;
  const baseCenterY = HEADER_HEIGHT + SCREEN_PADDING + (baseUsableHeight / 2);
  
  const tunedCenterX = baseCenterX + BOUNDS_TUNING.x;
  const tunedCenterY = baseCenterY + BOUNDS_TUNING.y;
  
  // Calculate bounds based on tuned size and position
  const minX = tunedCenterX - (tunedWidth / 2);
  const maxX = tunedCenterX + (tunedWidth / 2);
  const minY = tunedCenterY - (tunedHeight / 2);
  const maxY = tunedCenterY + (tunedHeight / 2);
  
  return {
    width: tunedWidth,
    height: tunedHeight,
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY,
    centerX: tunedCenterX,
    centerY: tunedCenterY,
  };
};

/**
 * Constrains a button position to stay within screen bounds
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param buttonSize - Size of the button
 * @returns Constrained coordinates
 */
export const constrainToScreenBounds = (
  x: number,
  y: number,
  buttonSize: number
): { x: number; y: number } => {
  const bounds = getUsableScreenDimensions();
  
  // Calculate half button size for centering
  const halfSize = buttonSize / 5;
  
  // Calculate bounds with button size consideration
  const minX = bounds.minX + halfSize;
  const maxX = bounds.maxX - halfSize;
  const minY = bounds.minY + halfSize;
  const maxY = bounds.maxY - halfSize;
  
  // Constrain coordinates
  const constrainedX = Math.max(minX, Math.min(maxX, x));
  const constrainedY = Math.max(minY, Math.min(maxY, y));
  
  return { x: constrainedX, y: constrainedY };
};

/**
 * Worklet version of constrainToScreenBounds for use in gesture handlers
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param buttonSize - Size of the button
 * @returns Constrained coordinates
 */
export const constrainToScreenBoundsWorklet = (
  x: number,
  y: number,
  buttonSize: number
): { x: number; y: number } => {
  'worklet';
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  
  // Ensure we're working with landscape dimensions
  const width = Math.max(screenWidth, screenHeight);
  const height = Math.min(screenWidth, screenHeight);
  
  // Calculate the base usable area (in immersive mode, we use full screen)
  const baseUsableWidth = width - (SCREEN_PADDING * 2)-10;
  const baseUsableHeight = height - HEADER_HEIGHT - (SCREEN_PADDING * 2) - 115;
  
  // Apply tuning parameters
  const tunedWidth = baseUsableWidth * BOUNDS_TUNING.size;
  const tunedHeight = baseUsableHeight * BOUNDS_TUNING.size;
  
  // Calculate the tuned center position
  const baseCenterX = width / 2;
  const baseCenterY = HEADER_HEIGHT + SCREEN_PADDING + (baseUsableHeight / 2);
  
  const tunedCenterX = baseCenterX + BOUNDS_TUNING.x;
  const tunedCenterY = baseCenterY + BOUNDS_TUNING.y;
  
  // Calculate bounds based on tuned size and position
  const minX = tunedCenterX - (tunedWidth / 2);
  const maxX = tunedCenterX + (tunedWidth / 2)-60;
  const minY = tunedCenterY - (tunedHeight / 2);
  const maxY = tunedCenterY + (tunedHeight / 2);
  
  // Calculate half button size for centering
  const halfSize = buttonSize / 5;
  
  // Calculate bounds with button size consideration
  const adjustedMinX = minX + halfSize;
  const adjustedMaxX = maxX - halfSize;
  const adjustedMinY = minY + halfSize;
  const adjustedMaxY = maxY - halfSize;
  
  // Constrain coordinates
  const constrainedX = Math.max(adjustedMinX, Math.min(adjustedMaxX, x));
  const constrainedY = Math.max(adjustedMinY, Math.min(adjustedMaxY, y));
  
  return { x: constrainedX, y: constrainedY };
};

/**
 * Validates if a button position is within screen bounds
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param buttonSize - Size of the button
 * @returns True if within bounds
 */
export const isWithinScreenBounds = (
  x: number,
  y: number,
  buttonSize: number
): boolean => {
  const bounds = getUsableScreenDimensions();
  
  const halfSize = buttonSize / 5;
  
  const minX = bounds.minX + halfSize;
  const maxX = bounds.maxX - halfSize;
  const minY = bounds.minY + halfSize;
  const maxY = bounds.maxY - halfSize;
  
  return (
    x >= minX &&
    x <= maxX &&
    y >= minY &&
    y <= maxY
  );
};

/**
 * Gets safe default positions for new buttons
 * @param buttonSize - Size of the button
 * @returns Safe default coordinates
 */
export const getSafeDefaultPosition = (buttonSize: number = 50): { x: number; y: number } => {
  const bounds = getUsableScreenDimensions();
  
  // Position in the actual center of the usable area
  const x = bounds.centerX;
  const y = bounds.centerY;
  
  return constrainToScreenBounds(x, y, buttonSize);
};
