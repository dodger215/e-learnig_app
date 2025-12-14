// src/contexts/MeetingContext.jsx
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useSocket } from './SocketContext';
import socketService from '../api/socket';

const MeetingContext = createContext({});

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const peerConnections = useRef({});
  const localVideoRef = useRef();
  const screenStreamRef = useRef();

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  };

  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = async (socketId) => {
      console.log('User joined, creating offer for:', socketId);
      createPeerConnection(socketId);
      const pc = peerConnections.current[socketId];

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketService.sendWebRTCOffer({
          target: socketId,
          offer: pc.localDescription
        });
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    };

    const handleOffer = async (data) => {
      console.log('Received offer from:', data.caller);
      createPeerConnection(data.caller);
      const pc = peerConnections.current[data.caller];

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketService.sendWebRTCAnswer({
          target: data.caller,
          answer: pc.localDescription
        });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    const handleAnswer = async (data) => {
      console.log('Received answer from:', data.responder);
      const pc = peerConnections.current[data.responder];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Error setting remote description:', err);
        }
      }
    };

    const handleIceCandidate = async (data) => {
      const pc = peerConnections.current[data.sender];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleIceCandidate);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleIceCandidate);
    };
  }, [socket, localStream]);

  const createPeerConnection = (socketId) => {
    if (peerConnections.current[socketId]) return;

    const pc = new RTCPeerConnection(rtcConfig);
    peerConnections.current[socketId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.sendIceCandidate({
          target: socketId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Received remote track from:', socketId);
      setRemoteStreams(prev => {
        // Check if we already have a stream for this user
        const existing = prev.find(p => p.id === socketId);
        if (existing) return prev;

        return [...prev, { id: socketId, stream: event.streams[0] }];
      });
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const toggleScreenShare = async () => {
    // ... (keep existing implementation)
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = screenStream;

        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const senders = Object.values(peerConnections.current).map(pc =>
          pc.getSenders().find(s => s.track?.kind === 'video')
        );

        senders.forEach(sender => {
          if (sender) sender.replaceTrack(videoTrack);
        });

        // When screen sharing stops
        videoTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        const videoTrack = cameraStream.getVideoTracks()[0];

        const senders = Object.values(peerConnections.current).map(pc =>
          pc.getSenders().find(s => s.track?.kind === 'video')
        );

        senders.forEach(sender => {
          if (sender) sender.replaceTrack(videoTrack);
        });

        // Stop screen stream
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const addParticipant = (participant) => {
    setParticipants(prev => {
      if (!prev.find(p => p.id === participant.id)) {
        return [...prev, participant];
      }
      return prev;
    });
  };

  const removeParticipant = (participantId) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  const value = {
    localStream,
    setLocalStream,
    remoteStreams,
    setRemoteStreams,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    participants,
    messages,
    peerConnections,
    localVideoRef,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    addMessage,
    addParticipant,
    removeParticipant,
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};