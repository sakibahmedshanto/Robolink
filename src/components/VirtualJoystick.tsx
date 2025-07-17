import React from 'react';
import { View, StyleSheet, Text, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface VirtualJoystickProps {
  label?: string;
  size?: number;
  color?: string;
  sensitivity?: number;
}

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ label = 'Joystick', size = 80, color = '#007AFF', sensitivity = 50 }) => {
  // Stub: No actual joystick logic yet, just a placeholder UI
  return (
    <View style={[styles.container, { width: size, height: size, borderColor: color }]}> 
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={[styles.stick, { backgroundColor: color, width: size * 0.5, height: size * 0.5 }]} />
      <Text style={styles.sensitivity}>Sens: {sensitivity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stick: {
    borderRadius: 999,
    opacity: 0.7,
    marginBottom: 2,
  },
  sensitivity: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
  },
});

export default VirtualJoystick;
