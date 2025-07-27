/**
 * UDP Manager Singleton
 * Centralized UDP socket management for the entire application
 * Ensures consistent UDP functionality across all screens
 */

import { Buffer } from 'buffer';
import UdpSockets from 'react-native-udp';

export interface UdpConfig {
  port: number;
  enabled: boolean;
  intervalDelay: number;
}

class UdpManager {
  private static instance: UdpManager;
  private socket: any | null = null;
  private config: UdpConfig = {
    port: 1234,
    enabled: false,
    intervalDelay: 100
  };
  private isInitializing = false;

  private constructor() {}

  public static getInstance(): UdpManager {
    if (!UdpManager.instance) {
      UdpManager.instance = new UdpManager();
    }
    return UdpManager.instance;
  }
  /**
   * Initialize or update UDP socket with new configuration
   */
  public async initialize(config: UdpConfig): Promise<void> {
    console.log('🔧 UdpManager - Initialize called with config:', config);
    
    this.config = { ...config };

    if (!config.enabled) {
      console.log('🔧 UdpManager - UDP disabled, closing socket');
      this.closeSocket();
      return;
    }

    // If socket exists and port hasn't changed, no need to recreate
    if (this.socket && this.config.port === config.port) {
      console.log('🔧 UdpManager - Socket already exists with correct port, updating config only');
      return;
    }

    if (this.isInitializing) {
      console.log('🔧 UdpManager - Already initializing, skipping');
      return;
    }

    this.isInitializing = true;

    try {
      // Close existing socket if any
      this.closeSocket();

      // Create new socket
      await this.createSocket();
      console.log('🔧 UdpManager - Initialization completed successfully');
    } catch (error) {
      console.error('🔧 UdpManager - Error during initialization:', error);
      this.socket = null;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Create a new UDP socket
   */
  private async createSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔧 UdpManager - Creating new UDP socket on port:', this.config.port);

        const newSocket = UdpSockets.createSocket({
          type: 'udp4',
          reusePort: true,
        });

        // Set up error handler
        newSocket.on('error', (err) => {
          console.error('🔧 UdpManager - Socket Error:', err);
          this.socket = null;
          reject(err);
        });

        // Set up listening handler
        newSocket.on('listening', () => {
          try {
            newSocket.setBroadcast(true);
            console.log(`✅ UdpManager - Socket ready on port ${this.config.port}`);
            this.socket = newSocket;
            resolve();
          } catch (error) {
            console.error('🔧 UdpManager - Error setting broadcast:', error);
            reject(error);
          }
        });

        // Bind to port
        newSocket.bind(this.config.port);

      } catch (error) {
        console.error('🔧 UdpManager - Error creating socket:', error);
        reject(error);
      }
    });
  }

  /**
   * Close the current socket
   */
  private closeSocket(): void {
    if (this.socket) {
      console.log('🔧 UdpManager - Closing socket');
      try {
        this.socket.close();
      } catch (error) {
        console.error('🔧 UdpManager - Error closing socket:', error);
      }
      this.socket = null;
    }
  }
  /**
   * Send data via UDP
   */
  public sendData(data: string): boolean {
    console.log('🔧 UdpManager - sendData called with:', data);
    console.log('🔧 UdpManager - Current config:', this.config);
    
    if (!this.config.enabled) {
      console.warn('🔧 UdpManager - UDP disabled, not sending data');
      return false;
    }

    if (!this.socket) {
      console.warn('🔧 UdpManager - No socket available');
      return false;
    }

    if (typeof this.socket.send !== 'function') {
      console.warn('🔧 UdpManager - Socket send function not available');
      return false;
    }

    try {
      const buffer = Buffer.from(data, 'utf8');
      console.log('🔧 UdpManager - Sending to port:', this.config.port);
      this.socket.send(buffer, 0, buffer.length, this.config.port, '255.255.255.255');
      console.log('✅ UdpManager - Data sent successfully:', data);
      return true;
    } catch (error) {
      console.error('🔧 UdpManager - Send error:', error);
      return false;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): UdpConfig {
    return { ...this.config };
  }

  /**
   * Check if UDP is ready to send data
   */
  public isReady(): boolean {
    return this.config.enabled && this.socket !== null && typeof this.socket.send === 'function';
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    console.log('🔧 UdpManager - Destroying instance');
    this.closeSocket();
  }
}

export default UdpManager;
