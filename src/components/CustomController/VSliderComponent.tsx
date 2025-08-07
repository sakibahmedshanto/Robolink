import { useState } from "react";
import { BaseWidget } from "../../types/widget";
import { Text, View } from "react-native";
import VerticalSlider from "./VerticalSlider";

export interface VSliderWidget extends BaseWidget {
  type: 'VSLIDER';
  label: string;
  color: string;
  min: number;
  max: number;
  value: number;
}

const VSliderComponent: React.FC<{
  widget: VSliderWidget;
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
          {value}
        </Text>
        
        <VerticalSlider
          min={widget.min}
          max={widget.max}
          initialValue={value}
          barColor={widget.color}
          color={widget.color}
          backgroundColor={"white"}
          onValueChange={handleValueChange}          
          containerStyle={{ 
            width: widget.width - 12, // Account for padding
            height: widget.height - 16, // Account for padding and text
          }}
        />
      </View>
    );
}


export default VSliderComponent;
