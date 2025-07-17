import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GamepadInputs from '../components/GampadInputs';

type RootStackParamList = {
  GamepadInputs: undefined;
  CustomJoystick: undefined;
};

export default function GamepadInputScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Button
          title="Go to Custom Joystick"
          onPress={() => navigation.navigate('CustomJoystick')}
        />
        <GamepadInputs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#170F11',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
});
