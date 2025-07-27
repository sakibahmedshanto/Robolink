#!/usr/bin/env python3
"""
Simple UDP listener to test multi-button press transmission
from the React Native Custom Joystick Screen
"""

import socket
import time
from datetime import datetime

def main():
    # Create UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # Bind to all interfaces on port 1234 (default port)
    server_address = ('', 1234)
    sock.bind(server_address)
    
    print(f"🎮 Multi-Button Test UDP Listener")
    print(f"📡 Listening on {server_address[0]}:{server_address[1]}")
    print(f"⏰ Started at {datetime.now().strftime('%H:%M:%S')}")
    print("-" * 50)
    print("💡 Instructions:")
    print("1. Open Custom Joystick Screen in the app")
    print("2. Press multiple buttons simultaneously")
    print("3. Watch for multi-button data below")
    print("-" * 50)
    
    try:
        while True:
            # Receive data
            data, address = sock.recvfrom(1024)
            message = data.decode('utf-8')
            timestamp = datetime.now().strftime('%H:%M:%S.%f')[:-3]
            
            # Parse the key=value format
            parsed_data = {}
            if message:
                pairs = message.split(',')
                for pair in pairs:
                    if '=' in pair:
                        key, value = pair.split('=', 1)
                        try:
                            # Try to convert to number
                            parsed_data[key] = float(value) if '.' in value else int(value)
                        except ValueError:
                            parsed_data[key] = value
            
            # Count active buttons (value = 1)
            active_buttons = [key for key, value in parsed_data.items() 
                            if isinstance(value, (int, float)) and value == 1 
                            and not key.startswith(('T', 'timestamp'))]
            
            # Count analog inputs (non-zero, non-button values)
            analog_inputs = [key for key, value in parsed_data.items() 
                           if isinstance(value, (int, float)) and value != 0 and value != 1
                           and not key.startswith(('T', 'timestamp'))]
            
            # Display results
            print(f"[{timestamp}] 📱 From {address[0]}:{address[1]}")
            print(f"  📨 Raw: {message}")
            
            if active_buttons:
                print(f"  🎮 Active Buttons ({len(active_buttons)}): {', '.join(active_buttons)}")
                
                # Highlight multi-button presses
                if len(active_buttons) > 1:
                    print(f"  🔥 MULTI-BUTTON PRESS DETECTED! {len(active_buttons)} buttons pressed simultaneously")
            
            if analog_inputs:
                print(f"  🕹️  Analog Inputs ({len(analog_inputs)}): {', '.join([f'{k}={parsed_data[k]}' for k in analog_inputs])}")
            
            if not active_buttons and not analog_inputs:
                print(f"  ✅ No active inputs (all buttons released)")
            
            print()
            
    except KeyboardInterrupt:
        print("\n👋 Shutting down UDP listener...")
    finally:
        sock.close()

if __name__ == "__main__":
    main()
