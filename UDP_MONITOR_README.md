# Robolink UDP Monitor

A Streamlit-based real-time monitor for UDP commands sent from the React Native Robolink app.

## Features

- 🎮 **Real-time UDP monitoring** - Shows live data transmission from the React Native app
- 📊 **Message parsing** - Automatically parses the `<N v1 v2 ... vN>` format used by the app
- 🔘 **Button state display** - Shows which gamepad buttons are currently pressed
- 🕹️ **Analog input visualization** - Displays joystick and trigger values with normalization
- 📜 **Message history** - Keeps track of recent messages with timestamps
- 📈 **Statistics** - Shows message count and timing information

## Quick Start

### Option 1: Use the batch file (Windows)
```bash
# Double-click or run in command prompt:
start_udp_monitor.bat
```

### Option 2: Manual setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run the monitor
streamlit run test_udp.py
```

The monitor will open in your browser at `http://localhost:8501`

## Usage

1. **Start the monitor** - Click "🟢 Start Listening" to begin monitoring UDP port 1234
2. **Test with React Native app** - Enable UDP transmission in your Robolink app settings
3. **View real-time data** - See button presses, joystick movements, and parsed commands
4. **Monitor history** - Review recent messages and statistics

## Data Format

The monitor expects UDP messages in the format used by the React Native app:
```
<N v1 v2 v3 ... vN>
```

Where:
- `N` = Number of values
- `v1, v2, ...` = Button states (0/1) and analog values (-1000 to 1000)

## Gamepad Mapping

The monitor maps input values to standard gamepad controls:

### Buttons (0 = Released, 1 = Pressed)
- A, B, C, X, Y, Z
- L1, L2, R1, R2 (shoulder buttons)
- Left/Right thumb (stick buttons)
- Start, Select, Mode

### Analog Inputs (-1000 to 1000, normalized to -1.0 to 1.0)
- Left/Right stick X/Y axes
- Hat (D-pad) X/Y
- Left/Right triggers

## Features

### Real-time Display
- Shows the latest received message with full parsing
- Separate sections for buttons, analog inputs, and unknown values
- Color-coded status indicators

### Message History
- Last 20 messages with timestamps
- Active button count for quick overview
- Sender IP and port information

### Statistics
- Total message count
- Messages received in the last minute
- Time since last message

## Troubleshooting

### No messages received
1. Check that the React Native app has UDP transmission enabled
2. Verify both devices are on the same network
3. Ensure port 1234 is not blocked by firewall
4. Check the UDP port setting in the app matches the monitor (default: 1234)

### Parse errors
- The monitor handles various message formats gracefully
- Unknown formats are displayed as raw text
- Check the React Native app's data transmission format

## Development

The monitor is built with:
- **Streamlit** - Web interface framework
- **pandas** - Data display and manipulation
- **socket** - UDP communication
- **threading** - Non-blocking message reception

### File Structure
- `test_udp.py` - Main Streamlit application
- `requirements.txt` - Python dependencies
- `start_udp_monitor.bat` - Windows batch file for easy startup
