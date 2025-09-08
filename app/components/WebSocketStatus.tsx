"use client";

import React, { useState, useEffect } from 'react';
import SocketService from '@/app/lib/socket';
import { Badge } from './ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface WebSocketStatusProps {
  className?: string;
  showLabel?: boolean;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const checkConnection = () => {
      const connected = SocketService.isConnected();
      setIsConnected(connected);
      setLastChecked(new Date());
    };

    // Check immediately
    checkConnection();

    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000);

    // Listen to socket events if available
    const socket = SocketService.getSocket();
    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true);
        setLastChecked(new Date());
      });
      
      socket.on('disconnect', () => {
        setIsConnected(false);
        setLastChecked(new Date());
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
      }
    };
  }, []);

  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SOCKET_URL) {
    // Don't show status in development if socket URL is not configured
    return null;
  }

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className={`${className} flex items-center gap-1`}
      title={`Last checked: ${lastChecked.toLocaleTimeString()}`}
    >
      {isConnected ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {showLabel && (
        <span className="text-xs">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      )}
    </Badge>
  );
};

export default WebSocketStatus;
