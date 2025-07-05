/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { createStaticNavigation, useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamepadInputs from './components/GampadInputs';
import { Button } from '@react-navigation/elements';


function GamepadScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <GamepadInputs />
      </View>
      <Button onPress={() => navigation.navigate('Details' as never)}>
        Go to Details
      </Button>
    </SafeAreaView>
  );
}


function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Button onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    </SafeAreaView>
  )
}


const RootStack = createNativeStackNavigator({
  initialRouteName: 'GamepadInputs',
  screens: {
    GamepadInputs: GamepadScreen,
    Details: DetailsScreen
  },
});


const Navigation = createStaticNavigation(RootStack);


function App() {
  return <Navigation />
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
});

export default App;
