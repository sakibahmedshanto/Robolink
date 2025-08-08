import { ButtonWidget } from "../components/CustomController/ButtonComponent";
import { HSliderWidget } from "../components/CustomController/HSliderComponent";
import { JoystickWidget } from "../components/CustomController/JoystickComponent";
import { LCDWidget } from "../components/CustomController/LCDComponent";
import { LEDWidget } from "../components/CustomController/LEDComponent";
import { TerminalWidget } from "../components/CustomController/TerminalComponent";
import { ToggleWidget } from "../components/CustomController/ToggleButtonComponent";
import { VSliderWidget } from "../components/CustomController/VSliderComponent";

export interface BaseWidget {
  id: string;
  type: WidgetType;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  width: number; // Absolute pixels
  height: number; // Absolute pixels
}

export type Widget = JoystickWidget | ButtonWidget | ToggleWidget | HSliderWidget | VSliderWidget | LCDWidget | LEDWidget | TerminalWidget;
export type WidgetType = 'JOYSTICK' | 'BUTTON' | 'GPBUTTON' | 'TOGGLE' | 'HSLIDER' | 'VSLIDER' | 'LED' | 'LCD' | 'TERMINAL';
