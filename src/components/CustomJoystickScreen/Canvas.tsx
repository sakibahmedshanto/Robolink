/**
 * Canvas component for the Custom Joystick Screen
 * Renders the main area where joystick buttons are placed
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { JoystickButton } from './types';
import { getUsableScreenDimensions } from './screenBounds';
import AnimatedButton from './AnimatedButton';

interface CanvasProps {
  layout: JoystickButton[];
  isEditMode: boolean;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onEditButton: (index: number) => void;
  onRemoveButton: (id: string) => void;
  onSliderValueChange: (id: string, value: number) => void;
  onButtonPress?: (mapName: string, mapValue: number, pressed: boolean) => void;
  onJoystickMove?: (joystickId: string, x: number, y: number) => void;
  onSliderChange?: (mapName: string, mapValue: number, sliderValue: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  layout,
  isEditMode,
  onUpdatePosition,
  onEditButton,
  onRemoveButton,
  onSliderValueChange,
  onButtonPress,
  onJoystickMove,
  onSliderChange,
}) => {
  const bounds = getUsableScreenDimensions();
  
  return (
    <View style={styles.canvas}>
      {/* Boundary indicator when in edit mode */}
      {isEditMode && (
        <View 
          style={[
            styles.boundaryIndicator,
            {
              left: bounds.minX,
              top: bounds.minY,
              width: bounds.width,
              height: bounds.height,
            }
          ]} 
        />
      )}
      
      {/* Center point indicator for debugging (remove in production) */}
      {isEditMode && (
        <View 
          style={[
            styles.centerIndicator,
            {
              left: bounds.centerX - 5,
              top: bounds.centerY - 5,
            }
          ]} 
        />
      )}
        {layout.map((item, idx) => (
        <AnimatedButton
          key={item.id}
          item={item}
          index={idx}
          isEditMode={isEditMode}
          onUpdatePosition={onUpdatePosition}
          onEditButton={onEditButton}
          onRemoveButton={onRemoveButton}
          onSliderValueChange={onSliderValueChange}
          onButtonPress={onButtonPress}
          onJoystickMove={onJoystickMove}
          onSliderChange={onSliderChange}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0a0a0a', // Match the gamepad's dark background
  },  boundaryIndicator: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 0,
  },
  centerIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 5,
    zIndex: 1,
  },
});

export default Canvas;
