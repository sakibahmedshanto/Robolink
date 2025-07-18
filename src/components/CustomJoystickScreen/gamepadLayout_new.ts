/**
 * Gamepad Layout component for the Custom Joystick Screen
 * Creates a fixed gamepad-style layout exactly matching the provided gamepad image
 */

import { JoystickButton } from './types';
import { getUsableScreenDimensions, constrainToScreenBounds } from './screenBounds';

/**
 * Creates a gamepad-style layout with fixed positioning
 * Matches the exact layout from the provided gamepad image
 */
export const createGamepadLayout = (): JoystickButton[] => {
  const bounds = getUsableScreenDimensions();
  
  // Use the usable screen dimensions
  const width = bounds.width + bounds.minX + bounds.minX;
  const height = bounds.height + bounds.minY + (bounds.minY - 70); // Subtract header height
  
  // Calculate positions based on screen dimensions to match the image
  const leftJoystickX = width * 0.18;
  const rightJoystickX = width * 0.75;
  const joystickY = height * 0.75;
  
  const dpadX = width * 0.12;
  const dpadY = height * 0.35;
  
  const actionButtonsX = width * 0.85;
  const actionButtonsY = height * 0.45;
  const shoulderButtonsY = height * 0.12;
  const macroButtonsX = width * 0.45;
  const macroButtonsY = height * 0.28;
  
  // Helper function to create button with constrained position
  const createButton = (
    id: string,
    type: 'joystick' | 'direction' | 'action' | 'toggle',
    label: string,
    x: number,
    y: number,
    size: number,
    color: string,
    config: any
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
      config
    };
  };
  
  return [
    // Left Joystick (large, yellow/gold)
    createButton(
      'left-joystick',
      'joystick',
      '',
      leftJoystickX,
      joystickY,
      85,
      '#FFD700',
      { sensitivity: 50 }
    ),
    
    // Right Joystick (large, yellow/gold)
    createButton(
      'right-joystick',
      'joystick',
      '',
      rightJoystickX,
      joystickY,
      85,
      '#FFD700',
      { sensitivity: 50 }
    ),
    
    // D-Pad (Direction buttons arranged in cross pattern with yellow triangles)
    createButton(
      'dpad-up',
      'direction',
      '▲',
      dpadX,
      dpadY - 50,
      45,
      '#FFD700',
      { direction: 'up' }
    ),
    createButton(
      'dpad-down',
      'direction',
      '▼',
      dpadX,
      dpadY + 50,
      45,
      '#FFD700',
      { direction: 'down' }
    ),
    createButton(
      'dpad-left',
      'direction',
      '◀',
      dpadX - 50,
      dpadY,
      45,
      '#FFD700',
      { direction: 'left' }
    ),
    createButton(
      'dpad-right',
      'direction',
      '▶',
      dpadX + 50,
      dpadY,
      45,
      '#FFD700',
      { direction: 'right' }
    ),
    
    // Action Buttons (arranged in diamond pattern like Xbox controller)
    createButton(
      'action-y',
      'action',
      'Y',
      actionButtonsX,
      actionButtonsY - 50,
      42,
      '#32CD32',
      { action: 'jump' }
    ),
    createButton(
      'action-a',
      'action',
      'A',
      actionButtonsX,
      actionButtonsY + 50,
      42,
      '#32CD32',
      { action: 'confirm' }
    ),
    createButton(
      'action-x',
      'action',
      'X',
      actionButtonsX - 50,
      actionButtonsY,
      42,
      '#1E90FF',
      { action: 'interact' }
    ),
    createButton(
      'action-b',
      'action',
      'B',
      actionButtonsX + 50,
      actionButtonsY,
      42,
      '#FF6347',
      { action: 'cancel' }
    ),
    
    // Horn Button (positioned at bottom center)
    createButton(
      'horn',
      'action',
      '🔊',
      width * 0.5,
      height * 0.85,
      50,
      '#FFD700',
      { action: 'horn' }
    ),
    
    // Shoulder Buttons (positioned at the top)
    createButton(
      'l1',
      'action',
      'L1',
      width * 0.78,
      shoulderButtonsY,
      42,
      '#808080',
      { action: 'custom' }
    ),
    createButton(
      'l2',
      'action',
      'L2',
      width * 0.88,
      shoulderButtonsY,
      42,
      '#808080',
      { action: 'custom' }
    ),
    createButton(
      'r1',
      'action',
      'R1',
      width * 0.78,
      shoulderButtonsY + 65,
      42,
      '#808080',
      { action: 'custom' }
    ),
    createButton(
      'r2',
      'action',
      'R2',
      width * 0.88,
      shoulderButtonsY + 65,
      42,
      '#808080',
      { action: 'custom' }
    ),
    
    // Menu/System Buttons (positioned in the center)
    createButton(
      'menu',
      'action',
      'MENU',
      width * 0.45,
      height * 0.58,
      38,
      '#333333',
      { action: 'custom' }
    ),
    createButton(
      'back',
      'action',
      'BACK',
      width * 0.55,
      height * 0.58,
      38,
      '#333333',
      { action: 'custom' }
    ),
  ];
};
