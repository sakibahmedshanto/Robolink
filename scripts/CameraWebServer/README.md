# ESP32 Camera Web Server - React Native Compatible

This project contains an enhanced ESP32 camera web server that's optimized for streaming to React Native applications, along with testing tools and example code.

## Features

- **MJPEG Streaming**: Real-time video streaming via HTTP
- **Single Frame Capture**: On-demand JPEG image capture
- **React Native Compatible**: CORS headers and optimized endpoints
- **Python Test Suite**: Comprehensive testing tools
- **Enhanced Performance**: Optimized camera settings for streaming

## Hardware Setup

1. Connect your ESP32-CAM module
2. Make sure you have selected the correct camera model in `board_config.h`
3. Update WiFi credentials in `CameraWebServer.ino`

## Software Setup

### ESP32 Code

1. Open `CameraWebServer.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char *ssid = "YOUR_WIFI_NAME";
   const char *password = "YOUR_WIFI_PASSWORD";
   ```
3. Upload to your ESP32-CAM

### Python Testing Environment

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the camera stream test:
   ```bash
   python test_camera_stream.py 192.168.1.100
   ```
   (Replace with your ESP32's IP address)

## Available Endpoints

After uploading the code, your ESP32 will provide these endpoints:

### Web Server (Port 80)
- `http://<ESP32_IP>/` - Web interface
- `http://<ESP32_IP>/jpg` - Single JPEG frame capture
- `http://<ESP32_IP>/capture` - Alternative capture endpoint
- `http://<ESP32_IP>/status` - Camera status and settings

### Stream Server (Port 81)
- `http://<ESP32_IP>:81/stream` - MJPEG video stream

## Testing the Camera

### Using the Python Test Script

The included Python script provides comprehensive testing:

```bash
# Basic test (10 seconds of streaming)
python test_camera_stream.py 192.168.1.100

# Extended test (30 seconds)
python test_camera_stream.py 192.168.1.100 --duration 30

# Save a test image
python test_camera_stream.py 192.168.1.100 --save-image
```

### Manual Testing

1. **Web Interface**: Open `http://<ESP32_IP>` in your browser
2. **MJPEG Stream**: Open `http://<ESP32_IP>:81/stream` in your browser
3. **Single Frame**: Visit `http://<ESP32_IP>/jpg` to get a JPEG image

## React Native Integration

### Installation

1. Install the required React Native dependency:
   ```bash
   npm install react-native-webview
   ```

2. Copy `ESP32CameraStream.js` to your React Native project

3. Import and use the component:
   ```javascript
   import ESP32CameraStream from './ESP32CameraStream';
   
   function App() {
     return (
       <ESP32CameraStream esp32IP="192.168.1.100" />
     );
   }
   ```

### Platform-Specific Configuration

#### iOS
Add to `ios/YourApp/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

#### Android
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

## Streaming Modes

### MJPEG Stream Mode
- Real-time video streaming
- Lower latency
- Continuous frames
- Higher bandwidth usage

### Single Frame Mode
- On-demand capture
- Lower bandwidth
- Manual refresh or auto-refresh
- Better for slow connections

## Camera Settings

The camera is configured with optimized settings for streaming:

- **Frame Size**: VGA (640x480) for good balance of quality and performance
- **JPEG Quality**: 10 (high quality)
- **Frame Buffer**: Double buffering for smoother streaming
- **Pixel Format**: JPEG for compatibility

You can modify these settings in `CameraWebServer.ino`:

```cpp
config.frame_size = FRAMESIZE_VGA;     // QVGA, VGA, SVGA, XGA, SXGA, UXGA
config.jpeg_quality = 10;              // 0-63 (lower = higher quality)
config.fb_count = 2;                   // 1-2 (double buffering)
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check WiFi credentials
   - Verify ESP32 is connected to the network
   - Check IP address

2. **Stream Not Loading**
   - Verify port 81 is accessible
   - Check firewall settings
   - Test with the Python script first

3. **Poor Image Quality**
   - Increase JPEG quality (lower number)
   - Check camera focus and lighting
   - Verify camera module connection

4. **Low Frame Rate**
   - Reduce frame size
   - Increase JPEG compression (higher quality number)
   - Check network bandwidth

### Python Script Error Messages

- `✗ Failed to connect`: Check IP address and network connectivity
- `✗ JPEG image decoded successfully`: Camera hardware issue
- `✗ Stream not available`: Port 81 may be blocked or stream server not running

### React Native Issues

- **CORS Errors**: The ESP32 code includes proper CORS headers
- **Image Not Loading**: Check network permissions and cleartext traffic settings
- **WebView Issues**: Ensure react-native-webview is properly installed

## Performance Optimization

### For Better Frame Rate
1. Reduce frame size: `FRAMESIZE_QVGA` instead of `FRAMESIZE_VGA`
2. Increase JPEG compression: Set `jpeg_quality` to 15-20
3. Use single frame mode for slower networks

### For Better Quality
1. Increase frame size: `FRAMESIZE_SVGA` or `FRAMESIZE_XGA`
2. Decrease JPEG compression: Set `jpeg_quality` to 5-8
3. Ensure good lighting conditions

## Example Output

When everything is working correctly, you should see:

```
ESP32 Camera Stream Comprehensive Test
============================================================
✓ Successfully connected to ESP32 web server
✓ Camera status endpoint accessible
✓ Single JPEG capture successful (45231 bytes)
✓ JPEG image decoded successfully (640x480)
✓ Test image saved as test_capture.jpg
✓ Connected to MJPEG stream
✓ Correct MJPEG content type detected
✓ Stream boundary: 123456789000000000000987654321
✓ First frame decoded (640x480)
  Frames received: 30, FPS: 15.2
✓ Stream test completed: 152 frames in 10.0s (avg 15.2 FPS)

============================================================
TEST SUMMARY
============================================================
Basic connectivity: ✓ PASS
Camera status:      ✓ PASS
Single JPEG:        ✓ PASS
MJPEG stream:       ✓ PASS
Stream performance: 152 frames, 15.2 FPS

For React Native integration:
- MJPEG Stream URL: http://192.168.1.100:81/stream
- Single JPEG URL:  http://192.168.1.100/jpg
- Status URL:       http://192.168.1.100/status
```

## License

This project is based on the ESP32 Camera example and is licensed under the Apache License 2.0.
