# Setup and Testing Guide for React Native Bluetooth Gamepad
# ===========================================================

## 🚀 Quick Start Guide

### 1. Install Python Dependencies

First, install the required Python packages:

```bash
pip install -r requirements.txt
```

If that doesn't work, try:
```bash
pip install pybluez2
```

### 2. Platform-Specific Setup

#### Windows:
- Install Microsoft C++ Build Tools if you get compilation errors
- Make sure Bluetooth is enabled in Windows settings
- May need to run as Administrator

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install libbluetooth-dev python3-dev
pip install pybluez2
```

#### macOS:
```bash
brew install bluetooth
pip install pybluez2
```

### 3. Test Your Setup

Run the test script first:
```bash
python test_bluetooth.py
```

This will:
- Check if Bluetooth is working
- Scan for nearby devices
- Test connection capabilities

### 4. Run the Main Receiver

Once testing is successful:
```bash
python bluetooth_receiver.py
```

## 📱 Mobile App Configuration

### 1. Enable Bluetooth in Your React Native App

Make sure your app has Bluetooth permissions in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### 2. Connect from Mobile App

1. Make sure your computer's Bluetooth is discoverable
2. Open your React Native app
3. Go to the gamepad input screen
4. Enable Bluetooth sending in the app settings
5. Look for your computer in the Bluetooth device list
6. Connect to your computer

### 3. Test Button Inputs

Once connected:
1. Press buttons on your virtual gamepad
2. Move the analog sticks
3. Check the Python script output for real-time updates

## 🔧 Troubleshooting

### Common Issues:

1. **"PyBluez not found"**
   - Solution: `pip install pybluez2`

2. **"Bluetooth not available"**
   - Make sure Bluetooth is enabled on your computer
   - Check if your computer has Bluetooth capability

3. **"No devices found"**
   - Make sure your phone's Bluetooth is ON and DISCOVERABLE
   - Try moving devices closer together

4. **"Connection refused"**
   - Make sure the Python script is running first
   - Check firewall settings
   - Try restarting Bluetooth on both devices

5. **"Permission denied"**
   - On Linux, you might need to run with sudo
   - On Windows, try running as Administrator

### Data Format:

The app sends data in this format:
```
<count value1 value2 value3 ...>
```

Example:
```
<6 0 1 0 0.5 -0.3 1>
```

This means:
- 6 values total
- Button states: 0, 1, 0 (released, pressed, released)
- Analog values: 0.5, -0.3, 1

## 📊 Expected Output

When everything is working, you should see:
```
🎮 REACT NATIVE GAMEPAD RECEIVER
==================================================
📱 Connected to: XX:XX:XX:XX:XX:XX
⏰ Last update: 14:30:25
--------------------------------------------------
🔘 BUTTONS:
  A_Button        : 🟢 PRESSED
  B_Button        : ⚫ Released
  ...

🕹️ ANALOG STICKS:
  Left_Stick_X    : +0.500
  Left_Stick_Y    : -0.300
  ...
```

## 🎯 Next Steps

Once the basic connection is working, you can:
1. Add custom button mapping
2. Save button states to files
3. Forward data to other applications
4. Add audio/visual feedback
5. Create automation scripts based on button presses

## 🆘 Getting Help

If you're still having issues:
1. Run `python test_bluetooth.py` first
2. Check the console output for specific error messages
3. Make sure both devices are on the same Bluetooth range
4. Try restarting both the Python script and mobile app
