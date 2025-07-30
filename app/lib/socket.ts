"use client";

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(userId?: string, userType?: 'vendor' | 'user' | 'admin'): Socket {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      return this.socket!;
    }

    if (!this.socket || !this.socket.connected) {
      this.isConnecting = true;
      
      // Use environment variable for socket URL, fallback to localhost for development
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
      
      console.log(`Attempting to connect to socket server: ${socketUrl}`);
      
      this.socket = io(socketUrl, {
        auth: {
          userId,
          userType,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to socket server:', this.socket?.id);
        this.isConnecting = false;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from socket server:', reason);
        this.isConnecting = false;
        
        // Handle unexpected disconnections
        if (reason === 'io server disconnect') {
          // Server forcefully disconnected the socket
          console.log('Server disconnected the socket, will not reconnect automatically');
        } else {
          // Connection lost unexpectedly, will auto-reconnect
          console.log('Connection lost, attempting to reconnect...');
        }
      });

      this.socket.on('error', (error) => {
        console.error('🔴 Socket connection error:', error);
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection failed:', error);
        console.log('💡 Make sure the socket server is running on', socketUrl);
        this.isConnecting = false;
        
        // In development, provide helpful error message
        if (process.env.NODE_ENV === 'development') {
          console.log('💡 Development tip: The socket server is expected at localhost:8000');
          console.log('💡 If you don\'t have a socket server running, the app will work without real-time features');
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected to socket server after ${attemptNumber} attempts`);
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('🔴 Reconnection failed:', error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('🔴 Failed to reconnect after maximum attempts');
        console.log('💡 Real-time features will be disabled');
      });
    }

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting from socket server...');
      this.socket.disconnect();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.isConnecting = false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Room management
  public joinVendorRoom(vendorId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_vendor_room', { vendorId });
      console.log(`📍 Joined vendor room: ${vendorId}`);
    } else {
      console.warn('❌ Cannot join vendor room: Socket not connected');
    }
  }

  public leaveVendorRoom(vendorId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_vendor_room', { vendorId });
      console.log(`📍 Left vendor room: ${vendorId}`);
    }
  }

  public joinUserRoom(userId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_user_room', { userId });
      console.log(`📍 Joined user room: ${userId}`);
    } else {
      console.warn('❌ Cannot join user room: Socket not connected');
    }
  }

  public leaveUserRoom(userId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_user_room', { userId });
      console.log(`📍 Left user room: ${userId}`);
    }
  }

  // Reservation events
  public onNewReservation(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('new_reservation', callback);
    }
  }

  public onReservationUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('reservation_updated', callback);
    }
  }

  public onReservationCancelled(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('reservation_cancelled', callback);
    }
  }

  // Menu events
  public onMenuUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('menu_updated', callback);
    }
  }

  // Safe emit - only emit if connected
  public safeEmit(event: string, data: any): boolean {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
      return true;
    } else {
      console.warn(`❌ Cannot emit ${event}: Socket not connected. Data:`, data);
      return false;
    }
  }

  // Clean up listeners
  public removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  public removeListener(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default SocketService.getInstance();
