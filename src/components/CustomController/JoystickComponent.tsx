import React from 'react';
import { View } from 'react-native';
import { BaseWidget } from "../../types/widget";
import Joystick, { IReactNativeJoystickEvent } from "./Joystick";

export interface JoystickWidget extends BaseWidget {
  type: 'JOYSTICK';
  size: number; // Absolute pixels (used for both width and height)
  baseColor: string;
  stickColor: string;
}

const JoystickComponent: React.FC<{
  widget: JoystickWidget;
  absoluteLeft: number;
  absoluteTop: number;
  onValueChange: (x: number, y: number) => void;
}> = ({ widget, absoluteLeft, absoluteTop, onValueChange }) => {
  
  const handleMove = (data:IReactNativeJoystickEvent) => {
    // Pass the x, y coordinates to the parent component
    onValueChange(Math.round(data.position.x*10 || 0), Math.round(data.position.y*10 || 0));
  };

  const handleStop = () => {
    // Reset to center when joystick is released
    onValueChange(0, 0);
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: absoluteLeft,
        top: absoluteTop,
        width: widget.size,
        height: widget.size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Joystick
        color={widget.stickColor}
        radius={widget.size / 2}
        onMove={handleMove}
        onStop={handleStop}
      />
    </View>
  );
};

export default JoystickComponent;