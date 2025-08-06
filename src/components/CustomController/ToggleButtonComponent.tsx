import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions, // Import Dimensions for dynamic sizing
} from 'react-native';
import { BaseWidget } from '../../types/widget';


export interface ToggleWidget extends BaseWidget {
  type: 'TOGGLE';
  label: string;
  color: string;
  initial: boolean;
}

const ToggleComponent: React.FC<{ widget: ToggleWidget; absoluteLeft: number; absoluteTop: number; onToggle: (value: boolean) => void;
}> = ({ widget, absoluteLeft, absoluteTop, onToggle }) => {
  const [isOn, setIsOn] = useState(widget.initial);

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onToggle(newValue);
  };

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        left: absoluteLeft, // Use calculated absolute value
        top: absoluteTop,   // Use calculated absolute value
        width: widget.width,
        height: widget.height,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
      }}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      {/* <Text style={{ fontSize: 10, color: '#666', fontWeight: '600' }}>
        {widget.label}
      </Text> */}

      <View
        style={{
          width: 40,
          height: 20,
          borderRadius: 10,
          backgroundColor: isOn ? widget.color : '#E5E5E5',
          padding: 2,
          justifyContent: 'center',
          alignItems: isOn ? 'flex-end' : 'flex-start', // Move thumb based on state
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: 'white',
            // Animated transform for smooth toggle (requires Animated API for true animation)
            // For simplicity, direct translateX is used here, which will snap.
            // For smooth animation, use Animated.Value and interpolate.
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ToggleComponent;