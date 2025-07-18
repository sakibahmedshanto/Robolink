module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-gesture-handler/android/',
          packageImportPath: 'import com.swmansion.gesturehandler.RNGestureHandlerPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-gesture-handler/RNGestureHandler.podspec',
        },
      },
    },
    'react-native-reanimated': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-reanimated/android/',
          packageImportPath: 'import com.swmansion.reanimated.ReanimatedPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-reanimated/RNReanimated.podspec',
        },
      },
    },
  },
};
