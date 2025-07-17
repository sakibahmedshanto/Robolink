import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ToggleButton = ({ label }: { label: string }) => {
  const [active, setActive] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.active]}
      onPress={() => setActive(!active)}
    >
      <Text style={styles.text}>{label}: {active ? 'ON' : 'OFF'}</Text>
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
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ToggleButton;
