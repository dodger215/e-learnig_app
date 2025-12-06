import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for socket connection');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.setupListeners();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  setupListeners() {
    // Course chat
    this.socket.on('receive_message', (data) => {
      // This will be handled by the components
      console.log('New message received:', data);
    });

    // Meeting updates
    this.socket.on('user_joined', (socketId) => {
      console.log('User joined meeting:', socketId);
    });

    this.socket.on('offer', (data) => {
      console.log('Received WebRTC offer:', data);
    });

    this.socket.on('answer', (data) => {
      console.log('Received WebRTC answer:', data);
    });

    this.socket.on('ice_candidate', (data) => {
      console.log('Received ICE candidate:', data);
    });

    // Earnings updates for tutor
    this.socket.on('earning_update', (data) => {
      console.log('Earning update received:', data);
    });

    // Dashboard updates
    this.socket.on('dashboard_update', (data) => {
      console.log('Dashboard update received:', data);
    });
  }

  // Course chat methods
  joinCourse(courseId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_course', courseId);
    }
  }

  leaveCourse(courseId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_course', courseId);
    }
  }

  sendMessage(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', data);
    }
  }

  // Meeting methods
  joinMeeting(meetingId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_meeting', meetingId);
    }
  }

  leaveMeeting(meetingId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_meeting', meetingId);
    }
  }

  sendWebRTCOffer(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('offer', data);
    }
  }

  sendWebRTCAnswer(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('answer', data);
    }
  }

  sendIceCandidate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('ice_candidate', data);
    }
  }

  // Dashboard subscription
  subscribeToDashboard(role) {
    if (this.socket && this.isConnected) {
      this.socket.emit('dashboard_subscribe', role);
    }
  }

  unsubscribeFromDashboard(role) {
    if (this.socket && this.isConnected) {
      this.socket.emit('dashboard_unsubscribe', role);
    }
  }

  // Personal room for real-time notifications
  joinPersonalRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_personal', userId);
    }
  }

  leavePersonalRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_personal', userId);
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;