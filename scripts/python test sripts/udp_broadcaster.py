import socket
import time

# --- UDP Configuration ---
# The broadcast IP address. '<broadcast>' is a special address that sends the packet to all
# hosts on the local network segment.
BROADCAST_IP = '<broadcast>'

# The port number to send the UDP packets to. This must match the port on the receiving end.
UDP_PORT = 1234

def broadcast_udp_data():
    """
    Sets up a UDP socket and broadcasts a simple message.
    """
    # Create a UDP socket
    # AF_INET specifies the address family (IPv4).
    # SOCK_DGRAM specifies the socket type (UDP).
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    except socket.error as e:
        print(f"Error creating socket: {e}")
        return

    # Set the socket option to allow broadcasting.
    # SOL_SOCKET is the socket level.
    # SO_BROADCAST is the option to enable broadcast.
    try:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    except socket.error as e:
        print(f"Error setting socket options: {e}")
        sock.close()
        return

    print(f"UDP broadcaster started. Broadcasting to {BROADCAST_IP}:{UDP_PORT}")

    # A simple loop to broadcast data continuously
    counter = 0
    while True:
        # Create the data to be sent. Here, we use a simple string.
        # This is where you would put your actual data, like GPS coordinates.
        message = f"Hello from UDP broadcaster! Message number: {counter}"
        
        try:
            # Encode the string to bytes before sending.
            sock.sendto(message.encode('utf-8'), (BROADCAST_IP, UDP_PORT))
            print(f"Broadcasted: '{message}'")
        except socket.error as e:
            print(f"Error sending data: {e}")
            # You could add a break here if the error is critical
        
        # Increment the counter and wait for a few seconds before broadcasting again.
        counter += 1
        time.sleep(2)

if __name__ == '__main__':
    broadcast_udp_data()

