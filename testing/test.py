import socket
import time

PORT = 1234  # Same as sender's port

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind to all interfaces on the specified port
sock.bind(('', PORT))  # '' means 0.0.0.0

print(f"Listening for UDP broadcast on port {PORT}...")

while True:
    data, addr = sock.recvfrom(1024)
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    print(f"Received message: {data.decode()} from {addr} at {timestamp}")