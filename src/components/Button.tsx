import { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp, TextStyle, View } from 'react-native';

const MyButton = ({ title, onPress, style, textStyle, children }: { title?:string, onPress: () => void, style?: StyleProp<ViewStyle>, textStyle?: StyleProp<TextStyle>,
  children?: ReactNode
 }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {
      children && <View>{children}</View>
    }
    {
      title && <Text style={[styles.text, textStyle]}>{title}</Text>
    }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
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
