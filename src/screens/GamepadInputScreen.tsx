import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, Dimensions } from 'react-native';
import GamepadInputs from '../components/GampadInputs';
import WebViewStreamPlayer from '../components/WebViewStreamPlayer';
import { secondaryColor } from '../const/theme';

type RootStackParamList = {
  GamepadInputs: undefined;
  CustomJoystick: undefined;
  CustomController: undefined;
};

export default function GamepadInputScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={[styles.container, isLandscape && styles.containerLandscape]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        {/* Camera Stream Section */}
        <View style={[styles.streamContainer, isLandscape ? styles.streamLandscape : styles.streamPortrait]}>
          <WebViewStreamPlayer />
        </View>
        
        {/* Gamepad Controls Section */}
        <View style={[styles.controlsContainer, isLandscape ? styles.controlsLandscape : styles.controlsPortrait]}>
          <GamepadInputs />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
  streamContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  streamPortrait: {
    height: 300,
    marginBottom: 16,
  },
  streamLandscape: {
    flex: 1,
    marginRight: 16,
    minHeight: 200,
  },
  controlsContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 8,
  },
  controlsPortrait: {
    flex: 1,
  },
  controlsLandscape: {
    flex: 1,
    maxWidth: 400,
  },
});
