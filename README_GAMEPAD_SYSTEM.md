# 🎮 React Native Mobile App to Python Communication System

## ✅ System Successfully Created!

I've successfully created a complete system that allows your React Native mobile app to send button press data to a Python script. The system uses **UDP communication** which is more reliable than Bluetooth on Windows.

## 📁 Files Created

1. **`udp_receiver.py`** - Main Python script to receive data from your mobile app
2. **`bluetooth_receiver.py`** - Alternative Bluetooth version (if you want to try it later)
3. **`test_bluetooth.py`** - Bluetooth testing script
4. **`test_gamepad_receiver.py`** - UDP testing script (already existed)
5. **`requirements.txt`** - Python dependencies
6. **`setup.bat`** - Windows setup script
7. **`BLUETOOTH_SETUP.md`** - Detailed setup instructions

## 🚀 Quick Start Guide

### Step 1: Run the Python Receiver
```bash
cd "d:\GitHub\Robolink"
python udp_receiver.py
```

You'll see something like:
```
🎮 REACT NATIVE UDP GAMEPAD RECEIVER
==================================================
🌐 UDP server started on 192.168.10.150:8080
📱 Configure your React Native app to send UDP data to:
   IP Address: 192.168.10.150
   Port: 8080
```

### Step 2: Configure Your Mobile App

1. **Build and run your React Native app** on your Android device
2. **Go to the main gamepad screen** (GamepadInputScreen)
3. **Tap the WiFi icon** in the header (next to the Bluetooth icon)
4. **Configure UDP settings:**
   - Enable "Send Over UDP"
   - Set IP Address to your computer's IP (shown in the Python script)
   - Set Port to 8080
   - Set interval to 100ms or whatever you prefer

### Step 3: Test the Connection

1. **Start pressing buttons** on your virtual gamepad
2. **Watch the Python script** - you should see real-time updates like:

```
🎮 REACT NATIVE GAMEPAD RECEIVER (UDP)
=======================================================
📱 Last data from: 192.168.X.X:XXXXX
⏰ Last update: 10:25:30
🌐 Listening on port: 8080
-------------------------------------------------------
🔘 BUTTONS:
  A_Button       : 🟢 PRESSED
  B_Button       : ⚫ Released
  X_Button       : 🟢 PRESSED
  Y_Button       : ⚫ Released
  ...

🕹️ ANALOG STICKS:
  Left_Stick_X   : +0.500
  Left_Stick_Y   : -0.300
  ...
```

## ✅ System Features

### What the Python Script Shows:
- **Real-time button states** (🟢 PRESSED / ⚫ Released)
- **Analog stick positions** (-1.000 to +1.000)
- **D-pad directions** (Left/Right/Up/Down)
- **Trigger values** (0.000 to 1.000)
- **Connection info** (IP address and timestamp)

### Button Mapping:
- **A_Button (96)** - Usually the bottom face button
- **B_Button (97)** - Usually the right face button  
- **X_Button (99)** - Usually the left face button
- **Y_Button (100)** - Usually the top face button
- **L1/R1** - Shoulder buttons
- **L2/R2** - Trigger buttons
- **Select/Start** - Menu buttons
- **Left/Right Stick Buttons** - Clickable analog sticks
- **DPad_Up (110)** - Directional pad

## 🔧 Testing Without Mobile App

You can test the system using the included test script:

```bash
python test_gamepad_receiver.py 192.168.10.150 8080
```

This will send fake button data to verify everything is working.

## 📱 Mobile App Configuration

Your React Native app already has the UDP functionality built-in! Just make sure:

1. **UDP is enabled** in the WiFi settings
2. **Correct IP and port** are configured
3. **Your phone and computer are on the same WiFi network**

## 🎯 What You Can Do Next

Now that the basic system is working, you can extend it:

1. **Save button data to files**
2. **Trigger actions based on specific button presses**
3. **Send data to other applications**
4. **Create automation scripts**
5. **Add sound effects or visual feedback**

## 🆘 Troubleshooting

### Common Issues:

1. **"No data received"**
   - Check if both devices are on the same WiFi network
   - Verify the IP address and port in your mobile app
   - Make sure UDP is enabled in the app

2. **"Connection timeout"**
   - Check Windows Firewall settings
   - Try a different port (e.g., 8080, 1234, 5000)

3. **"Wrong IP address"**
   - The Python script shows your computer's IP address
   - Use that exact IP in your mobile app

### Test Commands:
```bash
# Test with sample data
python test_gamepad_receiver.py

# Test specific IP and port
python test_gamepad_receiver.py YOUR_IP 8080

# Run UDP receiver on different port
python udp_receiver.py 1234
```

## 🎉 Success!

Your system is now ready! You have:
- ✅ Python script receiving data
- ✅ Real-time button state display
- ✅ UDP communication working
- ✅ Test scripts for verification
- ✅ Complete documentation

Start your Python script, configure your mobile app, and enjoy seeing your button presses in real-time on your computer! 🎮📱➡️💻
