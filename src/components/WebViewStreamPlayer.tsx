import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

const WebViewStreamPlayer: React.FC = () => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'http://192.168.0.128:81/stream' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewStreamPlayer;
