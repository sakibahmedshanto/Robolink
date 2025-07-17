import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DirectionButton = ({ label, onPress }: { label: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1976D2',
    padding: 20,
    borderRadius: 40,
    margin: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default DirectionButton;
