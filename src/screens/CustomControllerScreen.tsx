import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomController from '../components/CustomController/CustomController';
import Orientation from 'react-native-orientation-locker';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { primaryColor } from '../const/theme';

const controllerData = {
  templateId: 'layout-1735157621',
  layoutName: 'PS4 Controller Layout',
  widgets: [
    {
      id: 'widget-1735157621-1',
      type: 'JOYSTICK',
      x: 11,
      y: 53,
      width: 150,
      height: 150,
      size: 150,
      baseColor: '#AAAAAA',
      stickColor: '#333333',
    },
    {
      id: 'widget-1735157621-2',
      type: 'JOYSTICK',
      x: 68,
      y: 53,
      width: 150,
      height: 150,
      size: 150,
      baseColor: '#AAAAAA',
      stickColor: '#333333',
    },
    {
      id: 'widget-1735157621-3',
      type: 'GPBUTTON',
      x: 79,
      y: 10,
      width: 50,
      height: 50,
      color: '#4285F4',
      label: '△',
    },
    {
      id: 'widget-1735157621-4',
      type: 'GPBUTTON',
      x: 87,
      y: 20,
      width: 50,
      height: 50,
      color: '#DB4437',
      label: 'X',
    },
    {
      id: 'widget-1735157621-5',
      type: 'GPBUTTON',
      x: 71,
      y: 20,
      width: 50,
      height: 50,
      color: '#F4B400',
      label: '⏹️',
    },
    {
      id: 'widget-1735157621-6',
      type: 'GPBUTTON',
      x: 79,
      y: 30,
      width: 50,
      height: 50,
      color: '#0F9D58',
      label: '○',
    },
    {
      id: 'widget-1735157621-7',
      type: 'BUTTON',
      x: 38,
      y: 14,
      width: 50,
      height: 30,
      min: 0,
      max: 1,
      color: '#666666',
      label: 'Share',
    },
    {
      id: 'widget-1735157621-8',
      type: 'BUTTON',
      x: 54,
      y: 14,
      width: 50,
      height: 30,
      min: 0,
      max: 1,
      color: '#666666',
      label: 'Option',
    },
    {
      id: 'widget-1754415646623-txw4s1h0y',
      type: 'TOGGLE',
      x: 45.625854514553836,
      y: 32.567718346815504,
      width: 80,
      height: 40,
      label: 'Toggle',
      color: '#8B5CF6',
      initial: false,
    },
    {
      id: 'widget-1754415665337-2gmjv5hu7',
      type: 'HSLIDER',
      x: 4,
      y: 7.348273696806096,
      width: 200,
      height: 60,
      label: 'Slider',
      color: '#10B981',
      min: 0,
      max: 100,
      value: 50,
    },
    {
      id: 'widget-1754415678072-uct997gia',
      type: 'VSLIDER',
      x: 45.8906274176561,
      y: 48.05480016924636,
      width: 30,
      height: 200,
      label: 'V.Slider',
      color: '#F59E0B',
      min: 0,
      max: 100,
      value: 50,
    },
  ],
};

const CustomControllerScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [mounted, setMounted] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Lock the screen to landscape when the component mounts
    Orientation.lockToLandscape();
    setTimeout(() => setMounted(true), 1000);
    // Unlock the screen to its default orientation (e.g., portrait) when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const handleWidgetInteraction = (
    widgetId: string,
    type: string,
    value: any,
  ) => {
    console.log(`Widget ${widgetId} - ${type}:`, value);
    // Handle the interaction (send to game, update state, etc.)
  };

  function goBack() {
    // Navigate back to the previous screen
    if(navigation.canGoBack()) navigation.goBack();
  }

  if (mounted) {
    return (
      <SafeAreaView style={styles.scrollView}>
        <ScrollView>
          <View style={styles.safeArea}>
            <View style={styles.headerContainer}>
              {/* Back Button */}
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              {/* Title */}
              <Text style={styles.titleText}>{controllerData.layoutName}</Text>
              {/* Placeholder for right-side buttons if needed */}
              <View style={styles.rightPlaceholder} />
            </View>
          </View>
          <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <StatusBar barStyle={'dark-content'} />
            <CustomController
              layout={controllerData as any}
              onWidgetInteraction={handleWidgetInteraction}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={styles.container}>
        <Text>Component Not Mounted</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#170F11',
  },
  container: {
    flex: 1,
  },
    safeArea: {
    backgroundColor: primaryColor,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56, // Standard header height
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rightPlaceholder: {
    width: 40, // Match the width of the back button for symmetrical layout
  },
});

export default CustomControllerScreen;
