#!/usr/bin/env python3
"""
Simple UDP listener for React Native gamepad data
Usage: python simple_udp_listener.py [port]
Default port: 1235
"""

import socket
import sys
import json
from datetime import datetime

def parse_gamepad_data(data_str):
    """Parse key=value,key=value format from React Native app"""
    try:
        # Handle both JSON format (legacy) and key=value format (new)
        if data_str.strip().startswith('{'):
            # JSON format
            return json.loads(data_str)
        else:
            # Key=value format: "LX=0.500,RY=-0.800,A=1,B=0,T=1234567890"
            pairs = data_str.strip().split(',')
            result = {}
            for pair in pairs:
                if '=' in pair:
                    key, value = pair.split('=', 1)
                    # Try to convert to appropriate type
                    try:
                        if '.' in value:
                            result[key] = float(value)
                        else:
                            result[key] = int(value)
                    except ValueError:
                        result[key] = value
            return result
    except Exception as e:
        print(f"Parse error: {e}")
        return None

def main():
    # Get port from command line or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 1235
    
    print(f"🎮 UDP Gamepad Listener starting on port {port}")
    print("Waiting for gamepad data from React Native app...")
    print("=" * 50)
    
    # Create UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('', port))
    
    try:
        while True:
            # Receive data
            data, addr = sock.recvfrom(1024)
            timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
            
            try:
                message = data.decode('utf-8')
                parsed_data = parse_gamepad_data(message)
                
                if parsed_data:
                    print(f"[{timestamp}] From {addr[0]}:{addr[1]}")
                    
                    # Display in a formatted way
                    if isinstance(parsed_data, dict):
                        # Separate axes and buttons for cleaner display
                        axes = {k: v for k, v in parsed_data.items() if k in ['LX', 'LY', 'RX', 'RY']}
                        buttons = {k: v for k, v in parsed_data.items() if k not in ['LX', 'LY', 'RX', 'RY', 'T', 'timestamp']}
                        
                        if axes:
                            print(f"  Axes: {axes}")
                        if buttons:
                            active_buttons = {k: v for k, v in buttons.items() if v != 0}
                            if active_buttons:
                                print(f"  Buttons: {active_buttons}")
                        
                        # Show timestamp if available
                        ts = parsed_data.get('T') or parsed_data.get('timestamp')
                        if ts:
                            print(f"  Timestamp: {ts}")
                    else:
                        print(f"  Data: {parsed_data}")
                else:
                    print(f"[{timestamp}] Raw: {message}")
                
                print()  # Empty line for readability
                    
            except UnicodeDecodeError:
                print(f"[{timestamp}] Binary data received from {addr[0]}:{addr[1]} (length: {len(data)})")
                print()
                
    except KeyboardInterrupt:
        print("\n👋 UDP listener stopped by user")
    finally:
        sock.close()

if __name__ == "__main__":
    main()
