import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { BaseWidget } from '../../types/widget';


export interface LEDWidget extends BaseWidget {
    type: 'LED';
    label: string;
    color: string
    size: number
    isOn?: boolean
    intensity?: number 
}

const LEDComponent: React.FC<{ widget: LEDWidget; absoluteLeft: number; absoluteTop: number;
}> = ({ widget, absoluteLeft, absoluteTop }) => {
    const actualIntensity = widget?.isOn ? (widget.intensity || 100) / 100 : 0;
    const ledOpacity = widget?.isOn ? 1 : 0.3;
    const glowOpacity = actualIntensity * 0.8;


  return (
    <View
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
    >
      <Text style={{ fontSize: 10, color: '#666', fontWeight: '600' }}>
        {widget.label}
      </Text>
       {/* LED Inner Ring */}
       <View
         style={{
           width: widget.size - 12,
           height: widget.size - 12,
           borderRadius: (widget.size - 12) / 2,
           backgroundColor: '#1a1a1a',
           borderWidth: 1,
           borderColor: '#333',
           alignItems: 'center',
           justifyContent: 'center',
         }}
       >
         {/* LED Light */}
         <View
           style={{
             width: widget.size - 16,
             height: widget.size - 16,
             borderRadius: (widget.size - 16) / 2,
             backgroundColor: widget?.isOn ? widget.color : '#2a2a2a',
             opacity: ledOpacity,
           }}
         />
         
         {/* Highlight Reflection */}
         <View
           style={{
             position: 'absolute',
             top: widget.size / 8,
             left: widget.size / 8,
             width: widget.size / 6,
             height: widget.size / 8,
             borderRadius: widget.size / 12,
             backgroundColor: 'rgba(255, 255, 255, 0.6)',
             opacity: widget?.isOn ? 0.8 : 0.3,
           }}
         />
       </View>

       {/* Glow Effect (when on) */}
       {widget?.isOn && (
         <View
           style={{
             position: 'absolute',
             width: widget.size + 8,
             height: widget.size + 8,
             borderRadius: (widget.size + 8) / 2,
             backgroundColor: widget.color,
             opacity: glowOpacity * 0.3,
             zIndex: -1,
           }}
         />
       )}

    </View>
  );
};

export default LEDComponent;