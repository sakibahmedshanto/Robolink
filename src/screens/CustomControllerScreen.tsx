import {
  Alert,
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
import { Layout } from '../types/layout';


const CustomControllerScreen = ({ route }:{
  route: { params: { layout: Layout } }
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [mounted, setMounted] = useState(false);
  const navigation = useNavigation();
  const [controllerData, setControllerData] = useState<any | null>(null);

  useEffect(() => {
    if(!route.params.layout?.layoutData) return;
    try {
      setControllerData(JSON.parse(route.params.layout?.layoutData));
    } catch (error) {
      console.log(error);
      Alert.alert((error as Error).message);
    }
  }, [route.params.layout])
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap:10 }}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                  <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                {
                  route.params.layout?.layoutData && controllerData ?
                  <>
                    <Text style={styles.titleText}>{controllerData.layoutName}</Text>
                  
                  </>
                  : null
                }
              </View>

              <View></View>
            </View>
          </View>
          {
            route.params.layout?.layoutData && controllerData ?
            <>
              <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <CustomController
                  layout={controllerData as any}
                  onWidgetInteraction={handleWidgetInteraction}
                />
              </View>
            </>
            : null
          }
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
    backgroundColor: primaryColor
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
    height: 60, // Standard header height
    paddingHorizontal: 16,
    paddingTop: 10,
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
