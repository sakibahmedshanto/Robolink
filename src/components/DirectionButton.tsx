import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DirectionButton = ({ 
  label, 
  onPress, 
  onPressIn, 
  onPressOut,
  id,
  direction,
  disabled = false 
}: { 
  label: string; 
  onPress?: () => void; 
  onPressIn?: () => void; 
  onPressOut?: () => void;
  id?: string;
  direction?: string;
  disabled?: boolean;
}) => {
  
  const handlePressIn = () => {
    console.log(`🎮 DirectionButton "${label}" pressed IN - ID: ${id}, Direction: ${direction}`);
    onPressIn?.();
  };

  const handlePressOut = () => {
    console.log(`🎮 DirectionButton "${label}" pressed OUT - ID: ${id}, Direction: ${direction}`);
    onPressOut?.();
  };

  const handlePress = () => {
    console.log(`🎮 DirectionButton "${label}" tapped - ID: ${id}, Direction: ${direction}`);
    onPress?.();
  };

  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1976D2',
    padding: 20,
    borderRadius: 40,
    margin: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabledText: {
    color: '#999999',
  },
});

export default DirectionButton;
