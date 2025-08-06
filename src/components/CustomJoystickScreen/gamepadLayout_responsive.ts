/**
 * Gamepad Layout component for the Custom Joystick Screen
 * Creates a responsive gamepad-style layout that adapts to different screen sizes
 */

import { JoystickButton } from './types';
import { 
  getUsableScreenDimensions, 
  constrainToScreenBounds, 
  getPositionFromPercent,
  getButtonSize,
  getLayoutZones
} from './screenBounds';

/**
 * Creates a gamepad-style layout with responsive positioning
 * Adapts to different screen sizes while maintaining proportional layout
 */
export const createGamepadLayout = (): JoystickButton[] => {
  const zones = getLayoutZones();
  
  // Helper function to create button with responsive positioning
  const createButton = (
    id: string,
    type: 'joystick' | 'direction' | 'action' | 'toggle',
    label: string,
    xPercent: number,   // Position as percentage of usable area
    yPercent: number,   // Position as percentage of usable area
    sizeType: 'small' | 'medium' | 'large',
    color: string,
    config: any
  ): JoystickButton => {
    const position = getPositionFromPercent(xPercent, yPercent);
    const size = getButtonSize(sizeType);
    const constrainedPos = constrainToScreenBounds(position.x, position.y, size);
    
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
    // Left Joystick (large, in left zone, bottom area)
    createButton(
      'left-joystick',
      'joystick',
      '',
      0.15,  // 15% from left
      0.75,  // 75% down
      'large',
      '#FFD700',
      { sensitivity: 50 }
    ),
    
    // Right Joystick (large, in right zone, bottom area)
    createButton(
      'right-joystick',
      'joystick',
      '',
      0.85,  // 85% from left
      0.75,  // 75% down
      'large',
      '#FFD700',
      { sensitivity: 50 }
    ),
    
    // D-Pad (Direction buttons arranged in cross pattern)
    createButton(
      'dpad-up',
      'direction',
      '▲',
      0.12,  // 12% from left
      0.35,  // 35% down
      'medium',
      '#FFD700',
      { direction: 'up' }
    ),
    createButton(
      'dpad-down',
      'direction',
      '▼',
      0.12,  // 12% from left
      0.55,  // 55% down
      'medium',
      '#FFD700',
      { direction: 'down' }
    ),
    createButton(
      'dpad-left',
      'direction',
      '◀',
      0.06,  // 6% from left
      0.45,  // 45% down
      'medium',
      '#FFD700',
      { direction: 'left' }
    ),
    createButton(
      'dpad-right',
      'direction',
      '▶',
      0.18,  // 18% from left
      0.45,  // 45% down
      'medium',
      '#FFD700',
      { direction: 'right' }
    ),
    
    // Action Buttons (A, B, X, Y pattern on right side)
    createButton(
      'action-y',
      'action',
      'Y',
      0.88,  // 88% from left
      0.35,  // 35% down
      'medium',
      '#2563eb',
      { action: 'y' }
    ),
    createButton(
      'action-x',
      'action',
      'X',
      0.82,  // 82% from left
      0.45,  // 45% down
      'medium',
      '#dc2626',
      { action: 'x' }
    ),
    createButton(
      'action-a',
      'action',
      'A',
      0.88,  // 88% from left
      0.55,  // 55% down
      'medium',
      '#16a34a',
      { action: 'a' }
    ),
    createButton(
      'action-b',
      'action',
      'B',
      0.94,  // 94% from left
      0.45,  // 45% down
      'medium',
      '#f59e0b',
      { action: 'b' }
    ),
    
    // Shoulder Buttons (L1, R1, L2, R2 - top area)
    createButton(
      'shoulder-l1',
      'action',
      'L1',
      0.15,  // 15% from left
      0.05,  // 5% down (top area)
      'small',
      '#6b7280',
      { action: 'l1' }
    ),
    createButton(
      'shoulder-r1',
      'action',
      'R1',
      0.85,  // 85% from left
      0.05,  // 5% down (top area)
      'small',
      '#6b7280',
      { action: 'r1' }
    ),
    createButton(
      'shoulder-l2',
      'action',
      'L2',
      0.25,  // 25% from left
      0.05,  // 5% down (top area)
      'small',
      '#4b5563',
      { action: 'l2' }
    ),
    createButton(
      'shoulder-r2',
      'action',
      'R2',
      0.75,  // 75% from left
      0.05,  // 5% down (top area)
      'small',
      '#4b5563',
      { action: 'r2' }
    ),
    
    // Center Buttons (Start, Select, Home - center area)
    createButton(
      'start',
      'action',
      'START',
      0.6,   // 60% from left
      0.15,  // 15% down
      'small',
      '#374151',
      { action: 'start' }
    ),
    createButton(
      'select',
      'action',
      'SELECT',
      0.4,   // 40% from left
      0.15,  // 15% down
      'small',
      '#374151',
      { action: 'select' }
    ),
    createButton(
      'home',
      'action',
      'HOME',
      0.5,   // 50% from left (center)
      0.25,  // 25% down
      'small',
      '#1f2937',
      { action: 'home' }
    ),
    
    // Macro/Function Buttons (programmable buttons)
    createButton(
      'macro-1',
      'toggle',
      'M1',
      0.35,  // 35% from left
      0.35,  // 35% down
      'small',
      '#7c3aed',
      { action: 'macro1' }
    ),
    createButton(
      'macro-2',
      'toggle',
      'M2',
      0.45,  // 45% from left
      0.35,  // 35% down
      'small',
      '#7c3aed',
      { action: 'macro2' }
    ),
    createButton(
      'macro-3',
      'toggle',
      'M3',
      0.55,  // 55% from left
      0.35,  // 35% down
      'small',
      '#7c3aed',
      { action: 'macro3' }
    ),
    createButton(
      'macro-4',
      'toggle',
      'M4',
      0.65,  // 65% from left
      0.35,  // 35% down
      'small',
      '#7c3aed',
      { action: 'macro4' }
    ),
    
    // Thumb stick buttons (clickable joysticks)
    createButton(
      'left-thumb',
      'action',
      'LS',
      0.15,  // 15% from left
      0.9,   // 90% down (bottom corner)
      'small',
      '#FFD700',
      { action: 'left_thumb' }
    ),
    createButton(
      'right-thumb',
      'action',
      'RS',
      0.85,  // 85% from left
      0.9,   // 90% down (bottom corner)
      'small',
      '#FFD700',
      { action: 'right_thumb' }
    ),
  ];
};
