import Svg, { Circle, Rect, Defs, LinearGradient, Stop, RadialGradient, Text as SvgText } from 'react-native-svg';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { BaseWidget } from '../../types/widget';

export interface ButtonWidget extends BaseWidget {
  type: 'BUTTON' | 'GPBUTTON';
  color: string;
  label: string;
  min?: number;
  max?: number;
}
const ButtonComponent: React.FC<{ widget: ButtonWidget; absoluteLeft: number; absoluteTop: number; onPress: () => void; onPressIn?: () => void; onPressOut?: () => void;
}> = ({ widget, absoluteLeft, absoluteTop, onPress, onPressIn, onPressOut }) => {
  const [pressed, setPressed] = useState(false);

  const isGamepadButton = widget.type === 'GPBUTTON';
  // For gamepad buttons, use the smaller of width/height as the size for a circular button
  const size = isGamepadButton ? Math.min(widget.width, widget.height) : undefined;

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        left: absoluteLeft, // Use calculated absolute value
        top: absoluteTop,   // Use calculated absolute value
        width: widget.width,
        height: widget.height,
      }}
      onPress={onPress}
      onPressIn={() => {
        setPressed(true);
        onPressIn?.();
      }}
      onPressOut={() => {
        setPressed(false);
        onPressOut?.();
      }}
      activeOpacity={0.8}
    >
      {isGamepadButton ? (
        <Svg width={widget.width} height={widget.height}>
          <Defs>
            {/* Radial gradient for gamepad button background */}
            <RadialGradient id={`btn-${widget.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor={widget.color} stopOpacity="1" />
              <Stop offset="100%" stopColor={`${widget.color}AA`} stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Circular button shape */}
          <Circle
            cx={widget.width / 2}
            cy={widget.height / 2}
            r={(size || 50) / 2 - 2} // Default to 50 if size is undefined, subtract border
            fill={`url(#btn-${widget.id})`}
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity={pressed ? 0.8 : 1}
          />

          {/* Button label */}
          <SvgText
            x={widget.width / 2}
            y={widget.height / 2}
            textAnchor="middle"
            alignmentBaseline="central"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            {widget.label}
          </SvgText>
        </Svg>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: widget.color,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }], // Scale down on press
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {widget.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;