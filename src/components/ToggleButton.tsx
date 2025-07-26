import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ToggleButton = ({ 
  label, 
  id,
  action,
  disabled = false,
  onToggle
}: { 
  label: string; 
  id?: string;
  action?: string;
  disabled?: boolean;
  onToggle?: (active: boolean) => void;
}) => {
  const [active, setActive] = useState(false);
  
  const handlePress = () => {
    const newActiveState = !active;
    setActive(newActiveState);
    console.log(`🎮 ToggleButton "${label}" toggled ${newActiveState ? 'ON' : 'OFF'} - ID: ${id}, Action: ${action}`);
    onToggle?.(newActiveState);
  };

  return (
    <TouchableOpacity
      style={[styles.button, active && styles.active, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {label}: {active ? 'ON' : 'OFF'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#888',
    padding: 20,
    borderRadius: 40,
    margin: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#43A047',
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

export default ToggleButton;
