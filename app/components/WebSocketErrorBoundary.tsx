"use client";

import React, { Component, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class WebSocketErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a websocket related error
    const isWebSocketError = error.message.includes('WebSocket') || 
                            error.message.includes('socket') ||
                            error.message.includes('Connection');
    
    if (isWebSocketError) {
      return {
        hasError: true,
        errorMessage: error.message
      };
    }
    
    // Re-throw non-websocket errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WebSocket Error Boundary caught an error:', error, errorInfo);
    
    // Show user-friendly toast message
    if (process.env.NODE_ENV === 'development') {
      toast.warning(
        'WebSocket connection failed - Real-time features disabled. ' +
        'This is normal in development if no socket server is running.',
        { duration: 5000 }
      );
    } else {
      toast.error(
        'Real-time features temporarily unavailable. Please refresh the page.',
        { duration: 5000 }
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // Return children without the websocket functionality
      return this.props.children;
    }

    return this.props.children;
  }
}

export default WebSocketErrorBoundary;
