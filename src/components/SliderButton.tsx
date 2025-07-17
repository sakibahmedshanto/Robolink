import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SliderButtonProps {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  onValueChange: (value: number) => void;
  label?: string;
}

const SliderButton: React.FC<SliderButtonProps> = ({
  value,
  minimumValue = 0,
  maximumValue = 100,
  onValueChange,
  label = 'Slider',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}: {value}</Text>
      <Slider
        style={{ width: 120 }}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#888"
        thumbTintColor="#D72638"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9A825',
    padding: 20,
    borderRadius: 40,
    margin: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
});

export default SliderButton;
