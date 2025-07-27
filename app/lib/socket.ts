"use client";

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(userId?: string, userType?: 'vendor' | 'user' | 'admin'): Socket {
    if (!this.socket || !this.socket.connected) {
      // Use environment variable for socket URL, fallback to localhost for development
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
      
      this.socket = io(socketUrl, {
        auth: {
          userId,
          userType,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
      });

      this.socket.on('error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection failed:', error);
      });
    }

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  // Room management
  public joinVendorRoom(vendorId: string): void {
    if (this.socket) {
      this.socket.emit('join_vendor_room', { vendorId });
    }
  }

  public leaveVendorRoom(vendorId: string): void {
    if (this.socket) {
      this.socket.emit('leave_vendor_room', { vendorId });
    }
  }

  public joinUserRoom(userId: string): void {
    if (this.socket) {
      this.socket.emit('join_user_room', { userId });
    }
  }

  public leaveUserRoom(userId: string): void {
    if (this.socket) {
      this.socket.emit('leave_user_room', { userId });
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
