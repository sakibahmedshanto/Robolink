/**
 * Gamepad Layout component for the Custom Joystick Screen
 * Creates a fixed gamepad-style layout exactly matching the provided gamepad image
 */

import { Dimensions } from 'react-native';
import { JoystickButton } from './types';

const screen = Dimensions.get('window');

/**
 * Creates a gamepad-style layout with fixed positioning
 * Matches the exact layout from the provided gamepad image
 */
export const createGamepadLayout = (): JoystickButton[] => {
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  
  // Ensure we're working with landscape dimensions
  const width = Math.max(screenWidth, screenHeight);
  const height = Math.min(screenWidth, screenHeight);
  
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
  
  return [
    // Left Joystick (large, yellow/gold)
    {
      id: 'left-joystick',
      type: 'joystick',
      label: '',
      x: leftJoystickX,
      y: joystickY,
      size: 85,
      color: '#FFD700',
      config: { sensitivity: 50 }
    },
    
    // Right Joystick (large, yellow/gold)
    {
      id: 'right-joystick',
      type: 'joystick',
      label: '',
      x: rightJoystickX,
      y: joystickY,
      size: 85,
      color: '#FFD700',
      config: { sensitivity: 50 }
    },
    
    // D-Pad (Direction buttons arranged in cross pattern with yellow triangles)
    {
      id: 'dpad-up',
      type: 'direction',
      label: '▲',
      x: dpadX,
      y: dpadY - 50,
      size: 45,
      color: '#FFD700',
      config: { direction: 'up' }
    },
    {
      id: 'dpad-down',
      type: 'direction',
      label: '▼',
      x: dpadX,
      y: dpadY + 50,
      size: 45,
      color: '#FFD700',
      config: { direction: 'down' }
    },
    {
      id: 'dpad-left',
      type: 'direction',
      label: '◀',
      x: dpadX - 50,
      y: dpadY,
      size: 45,
      color: '#FFD700',
      config: { direction: 'left' }
    },
    {
      id: 'dpad-right',
      type: 'direction',
      label: '▶',
      x: dpadX + 50,
      y: dpadY,      size: 45,
      color: '#FFD700',
      config: { direction: 'right' }
    },
    
    // Action Buttons (positioned exactly like in the image)
    {
      id: 'action-a',
      type: 'action',
      label: 'A',
      x: actionButtonsX,
      y: actionButtonsY + 50,
      size: 50,
      color: '#32CD32',
      config: { action: 'fire' }
    },
    {
      id: 'action-b',
      type: 'action',
      label: 'B',
      x: actionButtonsX + 50,
      y: actionButtonsY,
      size: 50,
      color: '#DC143C',
      config: { action: 'grab' }
    },
    {
      id: 'action-x',
      type: 'action',
      label: 'X',
      x: actionButtonsX - 50,
      y: actionButtonsY,
      size: 50,
      color: '#1E90FF',
      config: { action: 'lights' }
    },
    {
      id: 'action-y',
      type: 'action',
      label: 'Y',
      x: actionButtonsX,
      y: actionButtonsY - 50,
      size: 50,
      color: '#FFD700',
      config: { action: 'horn' }
    },
    
    // Shoulder Buttons (positioned at the top)
    {
      id: 'l1',
      type: 'action',
      label: 'L1',
      x: width * 0.78,
      y: shoulderButtonsY,
      size: 42,
      color: '#808080',
      config: { action: 'custom' }
    },
    {
      id: 'l2',
      type: 'action',
      label: 'L2',
      x: width * 0.88,
      y: shoulderButtonsY,
      size: 42,
      color: '#808080',
      config: { action: 'custom' }
    },
    {
      id: 'r1',
      type: 'action',
      label: 'R1',
      x: width * 0.78,
      y: shoulderButtonsY + 65,
      size: 42,
      color: '#808080',
      config: { action: 'custom' }
    },
    {
      id: 'r2',
      type: 'action',
      label: 'R2',
      x: width * 0.88,
      y: shoulderButtonsY + 65,
      size: 42,
      color: '#808080',
      config: { action: 'custom' }
    },
    
    // Macro Buttons (arranged in 2x3 grid like in the image)
    {
      id: 'macro-1',
      type: 'toggle',
      label: '1\nMACRO',
      x: macroButtonsX - 60,
      y: macroButtonsY - 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    {
      id: 'macro-2',
      type: 'toggle',
      label: '2\nMACRO',
      x: macroButtonsX - 60,
      y: macroButtonsY + 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    {
      id: 'macro-3',
      type: 'toggle',
      label: '3\nMACRO',
      x: macroButtonsX - 10,
      y: macroButtonsY - 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    {
      id: 'macro-4',
      type: 'toggle',
      label: '4\nMACRO',
      x: macroButtonsX - 10,
      y: macroButtonsY + 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    {
      id: 'macro-5',
      type: 'toggle',
      label: '5\nMACRO',
      x: macroButtonsX + 40,
      y: macroButtonsY - 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    {
      id: 'macro-6',
      type: 'toggle',
      label: '6\nMACRO',
      x: macroButtonsX + 40,
      y: macroButtonsY + 35,
      size: 42,
      color: '#8B4513',
      config: { action: 'custom' }
    },
    
    // Menu/System Buttons (positioned in the center)
    {
      id: 'menu',
      type: 'action',
      label: 'MENU',
      x: width * 0.45,
      y: height * 0.58,
      size: 38,
      color: '#333333',
      config: { action: 'custom' }
    },
    {
      id: 'back',
      type: 'action',
      label: 'BACK',
      x: width * 0.55,
      y: height * 0.58,
      size: 38,
      color: '#333333',
      config: { action: 'custom' }
    },
  ];
};
