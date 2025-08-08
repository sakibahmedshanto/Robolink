import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text } from 'react-native';

interface WebViewStreamPlayerProps {
  streamUrl?: string;
}

const WebViewStreamPlayer: React.FC<WebViewStreamPlayerProps> = ({ 
  streamUrl = 'http://192.168.0.128:81/stream' 
}) => {
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Unable to load camera stream</Text>
      <Text style={styles.errorSubtext}>Check camera connection and network</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: streamUrl }}
        style={styles.webview}
        renderError={renderError}
        startInLoadingState={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WebViewStreamPlayer;
