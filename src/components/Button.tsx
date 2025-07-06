import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

const MyButton = ({ title, onPress, style, textStyle }: { title:string, onPress: () => void, style?: StyleProp<ViewStyle>, textStyle?: StyleProp<TextStyle> }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00ff47',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal:8,
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 12,
  },
});

export default MyButton;
