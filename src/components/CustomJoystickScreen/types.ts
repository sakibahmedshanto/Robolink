/**
 * Type definitions for the Custom Joystick Screen components
 */

export interface JoystickButton {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  config?: {
    direction?: string;
    action?: string;
    sensitivity?: number;
    customCommand?: string;
  };
}

export interface SavedLayout {
  id: string;
  name: string;
  layout: JoystickButton[];
  createdAt: string;
}

export interface ButtonConfig {
  direction: string;
  action: string;
  size: number;
  color: string;
  sensitivity: number;
  customCommand: string;
}

export interface ButtonTypeOption {
  type: string;
  label: string;
  icon: string;
}
