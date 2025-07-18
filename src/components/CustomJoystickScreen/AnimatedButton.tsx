/**
 * Animated Button component for the Custom Joystick Screen
 * Handles dragging, editing, and rendering of individual joystick buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { JoystickButton } from './types';
import { constrainToScreenBoundsWorklet } from './screenBounds';
import DirectionButton from '../DirectionButton';
import ActionButton from '../ActionButton';
import ToggleButton from '../ToggleButton';
import SliderButton from '../SliderButton';
import VirtualJoystick from '../VirtualJoystick';

interface AnimatedButtonProps {
  item: JoystickButton;
  index: number;
  isEditMode: boolean;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onEditButton: (index: number) => void;
  onRemoveButton: (id: string) => void;
  onSliderValueChange: (id: string, value: number) => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  item,
  index,
  isEditMode,
  onUpdatePosition,
  onEditButton,
  onRemoveButton,
  onSliderValueChange,
}) => {  // Animated values for position
  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);
  const startPosition = useSharedValue({ x: 0, y: 0 });

  // Update position when item changes
  React.useEffect(() => {
    translateX.value = item.x;
    translateY.value = item.y;
  }, [item.x, item.y, translateX, translateY]);

  // Pan gesture for dragging buttons
  const panGesture = Gesture.Pan()
    .enabled(isEditMode)
    .onStart(() => {
      startPosition.value = { x: translateX.value, y: translateY.value };
    })    .onUpdate((event) => {
      const newX = startPosition.value.x + event.translationX;
      const newY = startPosition.value.y + event.translationY;
      
      // Constrain to screen bounds during drag
      const constrainedPos = constrainToScreenBoundsWorklet(newX, newY, item.size);
      
      translateX.value = constrainedPos.x;
      translateY.value = constrainedPos.y;
    })
    .onEnd(() => {
      const finalX = translateX.value;
      const finalY = translateY.value;
      
      // Ensure final position is within bounds
      const constrainedPos = constrainToScreenBoundsWorklet(finalX, finalY, item.size);
      
      translateX.value = constrainedPos.x;
      translateY.value = constrainedPos.y;
      
      runOnJS(onUpdatePosition)(item.id, constrainedPos.x, constrainedPos.y);
    });

  // Animated style for position
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  /**
   * Renders the appropriate button component based on type
   */
  const renderButtonComponent = (): React.ReactElement => {
    const commonProps = {
      label: item.label,
      size: item.size,
      color: item.color,
      ...item.config,
    };

    switch (item.type) {
      case 'direction':
        return <DirectionButton {...commonProps} />;
      case 'action':
        return <ActionButton {...commonProps} />;
      case 'toggle':
        return <ToggleButton {...commonProps} />;
      case 'slider':
        return (
          <SliderButton
            {...commonProps}
            value={item.config?.sensitivity || 50}
            onValueChange={(value: number) => onSliderValueChange(item.id, value)}
          />
        );
      case 'joystick':
        return <VirtualJoystick {...commonProps} />;
      default:
        return <ActionButton {...commonProps} />;
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.draggableContainer, animatedStyle, styles.absolutePosition]}>
        {renderButtonComponent()}
        {isEditMode && (
          <View style={styles.editControls}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEditButton(index)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemoveButton(item.id)}
            >
              <Text style={styles.removeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    alignItems: 'center',
  },
  absolutePosition: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  editControls: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AnimatedButton;
