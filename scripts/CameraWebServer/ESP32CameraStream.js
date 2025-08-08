/**
 * ESP32 Camera Stream Component for React Native
 * 
 * This component demonstrates how to integrate the ESP32 camera stream
 * into a React Native application using both MJPEG streaming and
 * single frame capture methods.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width: screenWidth } = Dimensions.get('window');

const ESP32CameraStream = ({ esp32IP = '192.168.1.100' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamMode, setStreamMode] = useState('mjpeg'); // 'mjpeg' or 'single'
  const [singleFrameUri, setSingleFrameUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const webServerUrl = `http://${esp32IP}`;
  const streamServerUrl = `http://${esp32IP}:81`;
  const mjpegStreamUrl = `${streamServerUrl}/stream`;
  const singleJpegUrl = `${webServerUrl}/jpg`;
  const statusUrl = `${webServerUrl}/status`;

  // Test connection to ESP32
  const testConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch(webServerUrl, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        setIsConnected(true);
        Alert.alert('Success', 'Connected to ESP32 camera!');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setIsConnected(false);
      Alert.alert('Connection Error', `Failed to connect to ESP32: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Capture single frame
  const captureSingleFrame = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const urlWithTimestamp = `${singleJpegUrl}?t=${timestamp}`;
      
      // Test if the image loads successfully
      const response = await fetch(urlWithTimestamp, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        setSingleFrameUri(urlWithTimestamp);
        setLastUpdate(timestamp);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Capture Error', `Failed to capture frame: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh single frame mode
  useEffect(() => {
    let interval;
    if (streamMode === 'single' && isConnected) {
      interval = setInterval(() => {
        captureSingleFrame();
      }, 1000); // Refresh every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streamMode, isConnected]);

  // MJPEG Stream Component using WebView
  const MJPEGStreamView = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #000;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .error {
              color: white;
              text-align: center;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <img 
            src="${mjpegStreamUrl}" 
            alt="ESP32 Camera Stream"
            onerror="this.style.display='none'; document.body.innerHTML='<div class=\\"error\\">Stream not available</div>'"
          />
        </body>
      </html>
    `;

    return (
      <WebView
        source={{ html }}
        style={styles.streamView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading stream...</Text>
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          Alert.alert('Stream Error', `Failed to load MJPEG stream: ${nativeEvent.description}`);
        }}
      />
    );
  };

  // Single Frame Component
  const SingleFrameView = () => (
    <View style={styles.singleFrameContainer}>
      {singleFrameUri ? (
        <Image
          source={{ uri: singleFrameUri }}
          style={styles.singleFrameImage}
          resizeMode="contain"
          onError={() => {
            Alert.alert('Image Error', 'Failed to load image from ESP32');
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No image captured yet</Text>
        </View>
      )}
      
      <View style={styles.singleFrameControls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={captureSingleFrame}
          disabled={loading}
        >
          <Text style={styles.captureButtonText}>
            {loading ? 'Capturing...' : 'Capture Frame'}
          </Text>
        </TouchableOpacity>
        
        {singleFrameUri && (
          <Text style={styles.timestampText}>
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ESP32 Camera Stream</Text>
        <Text style={styles.subtitle}>IP: {esp32IP}</Text>
        
        <View style={styles.connectionStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !isConnected && styles.buttonDisabled]}
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Connecting...' : 'Test Connection'}
          </Text>
        </TouchableOpacity>

        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              streamMode === 'mjpeg' && styles.modeButtonActive
            ]}
            onPress={() => setStreamMode('mjpeg')}
            disabled={!isConnected}
          >
            <Text style={[
              styles.modeButtonText,
              streamMode === 'mjpeg' && styles.modeButtonTextActive
            ]}>
              MJPEG Stream
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              streamMode === 'single' && styles.modeButtonActive
            ]}
            onPress={() => setStreamMode('single')}
            disabled={!isConnected}
          >
            <Text style={[
              styles.modeButtonText,
              streamMode === 'single' && styles.modeButtonTextActive
            ]}>
              Single Frame
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stream Display */}
      <View style={styles.streamContainer}>
        {isConnected ? (
          streamMode === 'mjpeg' ? (
            <MJPEGStreamView />
          ) : (
            <SingleFrameView />
          )
        ) : (
          <View style={styles.disconnectedContainer}>
            <Text style={styles.disconnectedText}>
              Connect to ESP32 to view camera stream
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Stream URL: {mjpegStreamUrl}
        </Text>
        <Text style={styles.infoText}>
          Single Frame URL: {singleJpegUrl}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  controls: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#2196F3',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  streamContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  streamView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  singleFrameContainer: {
    flex: 1,
  },
  singleFrameImage: {
    flex: 1,
    width: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 18,
  },
  singleFrameControls: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timestampText: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.8,
  },
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedText: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  info: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default ESP32CameraStream;

/**
 * Usage Example:
 * 
 * import ESP32CameraStream from './ESP32CameraStream';
 * 
 * function App() {
 *   return (
 *     <ESP32CameraStream esp32IP="192.168.1.100" />
 *   );
 * }
 * 
 * Dependencies needed:
 * npm install react-native-webview
 * 
 * For iOS, add to Info.plist:
 * <key>NSAppTransportSecurity</key>
 * <dict>
 *   <key>NSAllowsArbitraryLoads</key>
 *   <true/>
 * </dict>
 * 
 * For Android, add to android/app/src/main/AndroidManifest.xml:
 * android:usesCleartextTraffic="true"
 */
