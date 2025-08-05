/**
 * Gamepad Layout component for the Custom Joystick Screen
 * Creates a fixed gamepad-style layout with the new button configuration
 */

import { JoystickButton } from './types';
import { getUsableScreenDimensions, constrainToScreenBounds } from './screenBounds';

/**
 * Creates a gamepad-style layout with fixed positioning
 * Uses the new mapName:mapValue button configuration
 */
export const createGamepadLayout = (): JoystickButton[] => {
  const bounds = getUsableScreenDimensions();
  
  // Use the actual screen dimensions for positioning
  const screenWidth = Math.max(bounds.width + (bounds.minX * 2), bounds.maxX);
  const screenHeight = Math.max(bounds.height + bounds.minY + 20, bounds.maxY);
  
  // Calculate positions based on screen dimensions
  const dpadX = screenWidth * 0.12;
  const dpadY = screenHeight * 0.50;
  
  const actionButtonsX = screenWidth * 0.85;
  const actionButtonsY = screenHeight * 0.50;
  
  const sliderX = screenWidth * 0.50;
  const sliderY = screenHeight * 0.25;
  
  // Helper function to create button with constrained position
  const createButton = (
    id: string,
    type: 'direction' | 'action' | 'slider',
    label: string,
    x: number,
    y: number,
    size: number,
    color: string,
    mapName: string,
    mapValue: number
  ): JoystickButton => {
    const constrainedPos = constrainToScreenBounds(x, y, size);
    return {
      id,
      type,
      label,
      x: constrainedPos.x,
      y: constrainedPos.y,
      size,
      color,
      mapName,
      mapValue
    };
  };
  
  return [
    // D-Pad (Direction buttons arranged in cross pattern)
    createButton(
      'dpad-up',
      'direction',
      '▲',
      dpadX,
      dpadY - 50,
      45,
      '#2563eb',
      'forward',
      100
    ),
    createButton(
      'dpad-down',
      'direction',
      '▼',
      dpadX,
      dpadY + 50,
      45,
      '#2563eb',
      'backward',
      100
    ),
    createButton(
      'dpad-left',
      'direction',
      '◀',
      dpadX - 50,
      dpadY,
      45,
      '#2563eb',
      'left',
      100
    ),
    createButton(
      'dpad-right',
      'direction',
      '▶',
      dpadX + 50,
      dpadY,
      45,
      '#2563eb',
      'right',
      100
    ),
    
    // Action Buttons (arranged in diamond pattern)
    createButton(
      'action-a',
      'action',
      'A',
      actionButtonsX,
      actionButtonsY + 50,
      45,
      '#16a34a',
      'fire',
      100
    ),
    createButton(
      'action-b',
      'action',
      'B',
      actionButtonsX + 50,
      actionButtonsY,
      45,
      '#dc2626',
      'grab',
      100
    ),
    createButton(
      'action-x',
      'action',
      'X',
      actionButtonsX - 50,
      actionButtonsY,
      45,
      '#0891b2',
      'release',
      100
    ),
    createButton(
      'action-y',
      'action',
      'Y',
      actionButtonsX,
      actionButtonsY - 50,
      45,
      '#f59e0b',
      'horn',
      100
    ),
    
    // Speed Control Slider
    createButton(
      'speed-slider',
      'slider',
      'Speed',
      sliderX,
      sliderY,
      100,
      '#7c3aed',
      'speed',
      500
    ),
    
    // Additional Action Buttons
    createButton(
      'lights',
      'action',
      'Lights',
      screenWidth * 0.3,
      screenHeight * 0.75,
      40,
      '#ea580c',
      'lights',
      100
    ),
    createButton(
      'camera',
      'action',
      'Camera',
      screenWidth * 0.7,
      screenHeight * 0.75,
      40,
      '#e11d48',
      'camera',
      100
    ),
  ];
};
