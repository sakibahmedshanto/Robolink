import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, Button } from 'react-native';
import GamepadInputs from '../components/GampadInputs';

type RootStackParamList = {
  GamepadInputs: undefined;
  CustomJoystick: undefined;
  CustomController: undefined;
};

export default function GamepadInputScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
