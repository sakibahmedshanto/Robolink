/**
 * Constants for the Custom Joystick Screen
 */

import { ButtonTypeOption } from './types';

export const BUTTON_TYPES: ButtonTypeOption[] = [
  { type: 'direction', label: 'Direction', icon: '↑' },
  { type: 'action', label: 'Action', icon: '●' },
  { type: 'slider', label: 'Slider', icon: '═' },
];

// Predefined map names for direction buttons
export const DIRECTION_MAP_OPTIONS: string[] = [
  'forward', 'backward', 'left', 'right', 'up', 'down', 'rotate_left', 'rotate_right'
];

// Predefined map names for action buttons
export const ACTION_MAP_OPTIONS: string[] = [
  'fire', 'grab', 'release', 'horn', 'lights', 'camera', 'brake', 'turbo'
];

// Predefined map names for slider buttons
export const SLIDER_MAP_OPTIONS: string[] = [
  'speed', 'steering', 'throttle', 'brake_intensity', 'volume', 'brightness'
];

export const COLOR_OPTIONS: string[] = [
  '#2563eb', '#dc2626', '#f59e0b', '#16a34a', '#7c3aed', '#e11d48', '#0891b2', '#ea580c'
];

export const DEFAULT_BUTTON_CONFIG = {
  mapName: 'forward',
  mapValue: 100,
  size: 60,
  color: '#2563eb',
};
