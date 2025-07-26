import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ActionButton = ({ 
  label, 
  onPress, 
  onPressIn, 
  onPressOut,
  id,
  action,
  disabled = false 
}: { 
  label: string; 
  onPress?: () => void; 
  onPressIn?: () => void; 
  onPressOut?: () => void;
  id?: string;
  action?: string;
  disabled?: boolean;
}) => {
  
  const handlePressIn = () => {
    console.log(`🎮 ActionButton "${label}" pressed IN - ID: ${id}, Action: ${action}`);
    onPressIn?.();
  };

  const handlePressOut = () => {
    console.log(`🎮 ActionButton "${label}" pressed OUT - ID: ${id}, Action: ${action}`);
    onPressOut?.();
  };

  const handlePress = () => {
    console.log(`🎮 ActionButton "${label}" tapped - ID: ${id}, Action: ${action}`);
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
    backgroundColor: '#D72638',
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

export default ActionButton;
