/**
 * Constants for the Custom Joystick Screen
 */

import { ButtonTypeOption } from './types';

export const BUTTON_TYPES: ButtonTypeOption[] = [
  { type: 'direction', label: 'Direction', icon: '↑' },
  { type: 'action', label: 'Action', icon: '●' },
  { type: 'toggle', label: 'Toggle', icon: '⚡' },
  { type: 'slider', label: 'Slider', icon: '═' },
  { type: 'joystick', label: 'Joystick', icon: '🕹️' },
];

export const DIRECTION_OPTIONS: string[] = [
  'up', 'down', 'left', 'right', 'forward', 'backward', 'rotate_left', 'rotate_right'
];

export const ACTION_OPTIONS: string[] = [
  'fire', 'grab', 'release', 'horn', 'lights', 'camera', 'custom'
];

export const COLOR_OPTIONS: string[] = [
  '#2563eb', '#dc2626', '#f59e0b', '#16a34a', '#7c3aed', '#e11d48', '#0891b2', '#ea580c'
];

export const DEFAULT_BUTTON_CONFIG = {
  direction: 'up',
  action: 'fire',
  size: 60,
  color: '#2563eb',
  sensitivity: 50,
  customCommand: '',
};
