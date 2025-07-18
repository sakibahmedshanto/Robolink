/**
 * Canvas component for the Custom Joystick Screen
 * Renders the main area where joystick buttons are placed
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { JoystickButton } from './types';
import AnimatedButton from './AnimatedButton';

interface CanvasProps {
  layout: JoystickButton[];
  isEditMode: boolean;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onEditButton: (index: number) => void;
  onRemoveButton: (id: string) => void;
  onSliderValueChange: (id: string, value: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  layout,
  isEditMode,
  onUpdatePosition,
  onEditButton,
  onRemoveButton,
  onSliderValueChange,
}) => {
  return (
    <View style={styles.canvas}>
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
  },
});

export default Canvas;
