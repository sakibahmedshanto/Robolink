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
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { primaryColor } from '../const/theme';
import { Layout } from '../types/layout';
import { useBluetoothStatus, useDTS, useUdpStatus } from '../atoms/configs';
import { BluetoothSerial } from '../specs';
import { broadcastUdpData, useUdpSocket } from '../atoms/udp';
import HeaderRightButtons from '../components/HeaderRightButtons';


const CustomControllerScreen = ({ route }:{
  route: { params: { layout: Layout } }
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [mounted, setMounted] = useState(false);
  const navigation = useNavigation();
  const [controllerData, setControllerData] = useState<any | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: any }>({});
  const [bluetoothStatus, _] = useBluetoothStatus();
  const [udpStatus, setUdpStatus] = useUdpStatus();
  const inputsRef = useRef(inputs);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const udpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { socket:udpSocket } = useUdpSocket();

  useEffect(() => {
    if(!route.params.layout?.layoutData) return;
    try {
      const parsedData = JSON.parse(route.params.layout.layoutData);
      setControllerData(parsedData);
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

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);


  useEffect(() => {
    if (!bluetoothStatus.isConnected || !bluetoothStatus.enableSendOverBT) return;
    if (btIntervalRef.current) clearInterval(btIntervalRef.current);

    btIntervalRef.current = setInterval(() => {
      const inputs = inputsRef.current;
      const result = getMessage(inputs);
      BluetoothSerial.writeToDevice(btoa(result));
    }, bluetoothStatus.intervalDelay || 100);
    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [bluetoothStatus.isConnected, bluetoothStatus.enableSendOverBT, bluetoothStatus.intervalDelay]);


  useEffect(() => {
    if (!udpStatus.enableSendOverUdp) {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
      return;
    }
    if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);

    udpIntervalRef.current = setInterval(() => {
      if (!udpStatus.enableSendOverUdp) {
        if(udpIntervalRef.current) clearInterval(udpIntervalRef.current);
        return;
      }
      
      const inputs = inputsRef.current;
      const result = getMessage(inputs);
      if(udpSocket) broadcastUdpData(udpSocket, result, udpStatus.port);
      else console.warn('UDP socket not available');
    }, udpStatus.intervalDelay || 100);

    return () => {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
      setUdpStatus(prev => ({ ...prev, enableSendOverUdp: false })); // Reset UDP status
    }
  
  }, [udpStatus.enableSendOverUdp, udpStatus.intervalDelay, udpStatus.port])


  const getMessage = (inputs: any) => {
    let result = `<${Object.keys(inputs).length} `;
    for (const [Key, val] of Object.entries(inputs)) {
      result += `${inputs[Key] || 0} `;
    }
    result += '>';
    return result;
  }
  
  const updateInputs = (evt: { [key: string]: any }) => {
    setInputs(prev => ({ ...prev, ...evt }));
  };

  const handleWidgetInteraction = (
    widgetId: string,
    type: string,
    value: any,
  ) => {
    // console.log(`Widget ${widgetId} - ${type}:`, value);
    // Handle the interaction (send to game, update state, etc.)
    if (type === 'JOYSTICK') {
      updateInputs({ [widgetId+"X"]: value.x, [widgetId+"Y"]: value.y });
    } else if (type === 'BUTTON' || type === 'TOGGLE' || type === 'GPBUTTON') {
      updateInputs({ [widgetId]: value ? 1 : 0 });
    } else if (type === 'HSLIDER' || type === 'VSLIDER') {
      updateInputs({ [widgetId]: value });
    }

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
                <HeaderRightButtons />
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
