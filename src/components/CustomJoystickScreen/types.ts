/**
 * Type definitions for the Custom Joystick Screen components
 */

export interface JoystickButton {
  id: string;
  type: 'direction' | 'action' | 'slider';
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  mapName: string; // The key used for data transmission (e.g., 'forward', 'backward', 'fire')
  mapValue: number; // The value sent when button is pressed/activated
}

export interface SavedLayout {
  id: string;
  name: string;
  layout: JoystickButton[];
  createdAt: string;
}

export interface ButtonConfig {
  mapName: string;
  mapValue: number;
  size: number;
  color: string;
}

export interface ButtonTypeOption {
  type: 'direction' | 'action' | 'slider';
  label: string;
  icon: string;
}
