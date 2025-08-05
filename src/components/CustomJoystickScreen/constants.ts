/**
 * Constants for the Custom Joystick Screen
 */

import { ButtonTypeOption } from './types';

export const BUTTON_TYPES: ButtonTypeOption[] = [
  { type: 'direction', label: 'Direction', icon: '↑' },
  { type: 'action', label: 'Action', icon: '●' },
  { type: 'slider', label: 'Slider', icon: '═' },
];

// Unified map options - all available map names
export const ALL_MAP_OPTIONS: string[] = [
  // Movement
  'forward', 'backward', 'left', 'right', 'up', 'down', 'rotate_left', 'rotate_right',
  // Actions
  'fire', 'grab', 'release', 'horn', 'lights', 'camera', 'brake', 'turbo',
  // Controls
  'speed', 'steering', 'throttle', 'brake_intensity', 'volume', 'brightness',
  // Custom placeholder
  'custom'
];

export const COLOR_OPTIONS: string[] = [
  '#2563eb', '#dc2626', '#f59e0b', '#16a34a', '#7c3aed', '#e11d48', '#0891b2', '#ea580c'
];

export const DEFAULT_BUTTON_CONFIG = {
  mapName: 'forward',
  mapValue: 100,
  size: 50,
  color: '#2563eb',
};
