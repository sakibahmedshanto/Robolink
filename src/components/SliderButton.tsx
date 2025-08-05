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
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#2563eb"
        maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        thumbTintColor="#fff"
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(39, 88, 180, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(235, 37, 37, 0.51)',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    minWidth: 140,
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    opacity: 0.9,
  },
  value: {
    color: '#eb3525ff',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 28,
    textAlign: 'center',
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 20,
  },
});

export default SliderButton;
