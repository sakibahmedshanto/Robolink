import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { BaseWidget } from '../../types/widget';

export interface SliderWidget extends BaseWidget {
  type: 'HSLIDER' | 'VSLIDER';
  label: string;
  color: string;
  min: number;
  max: number;
  value: number;
}

const SliderComponent: React.FC<{
  widget: SliderWidget;
  absoluteLeft: number;
  absoluteTop: number;
  onValueChange: (value: number) => void;
}> = ({ widget, absoluteLeft, absoluteTop, onValueChange }) => {
  const [value, setValue] = useState(widget.value);

  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    onValueChange(roundedValue);
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: absoluteLeft,
        top: absoluteTop,
        width: widget.width,
        height: widget.height,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'center',
      }}
    >
      <Text style={{ 
        fontSize: 10, 
        color: '#666', 
        fontWeight: '600', 
        marginBottom: 4,
        textAlign: 'center'
      }}>
        {widget.label}: {value}
      </Text>
      
      <Slider
        style={{ 
          width: widget.width - 16, // Account for padding
          height: widget.height - 32, // Account for padding and text
        }}
        minimumValue={widget.min}
        maximumValue={widget.max}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor={widget.color}
        maximumTrackTintColor="#E5E5E5"
        thumbTintColor={widget.color}
        step={1} // Ensures integer values
        vertical={widget.type === 'VSLIDER'} // Explicit orientation control
      />
    </View>
  );
};
export default SliderComponent;