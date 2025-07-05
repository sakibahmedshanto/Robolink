import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { useNavigation, } from '@react-navigation/native';
import GamepadInputs from '../components/GampadInputs';

export default function GamepadInputScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

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
