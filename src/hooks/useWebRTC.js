// src/hooks/useWebRTC.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

const useWebRTC = (meetingId, localStream) => {
  const socket = useSocket();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const peerConnections = useRef({});

  // Create RTCPeerConnection
  const createPeerConnection = useCallback((socketId) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnections.current[socketId] = pc;

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice_candidate', {
          target: socketId,
          candidate: event.candidate,
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStreams(prev => {
        const existingStream = prev.find(s => s.id === socketId);
        if (existingStream) {
          return prev.map(s => 
            s.id === socketId 
              ? { ...s, stream: event.streams[0] }
              : s
          );
        }
        return [...prev, { id: socketId, stream: event.streams[0] }];
      });
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state for ${socketId}:`, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeerConnection(socketId);
      }
    };

    return pc;
  }, [localStream, socket]);

  // Remove peer connection
  const removePeerConnection = useCallback((socketId) => {
    const pc = peerConnections.current[socketId];
    if (pc) {
      pc.close();
      delete peerConnections.current[socketId];
      setRemoteStreams(prev => prev.filter(s => s.id !== socketId));
    }
  }, []);

  // Create and send offer
  const createAndSendOffer = useCallback(async (socketId) => {
    try {
      const pc = createPeerConnection(socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.emit('offer', {
          target: socketId,
          offer: offer,
        });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [createPeerConnection, socket]);

  // Handle incoming offer
  const handleOffer = useCallback(async (socketId, offer) => {
    try {
      const pc = createPeerConnection(socketId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket) {
        socket.emit('answer', {
          target: socketId,
          answer: answer,
        });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [createPeerConnection, socket]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (socketId, answer) => {
    const pc = peerConnections.current[socketId];
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (socketId, candidate) => {
    const pc = peerConnections.current[socketId];
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (socketId) => {
      if (localStream) {
        createAndSendOffer(socketId);
      }
    };

    const handleOffer = (data) => {
      handleOffer(data.caller, data.offer);
    };

    const handleAnswer = (data) => {
      handleAnswer(data.responder, data.answer);
    };

    const handleIceCandidate = (data) => {
      handleIceCandidate(data.sender, data.candidate);
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
  }, [socket, localStream, createAndSendOffer, handleOffer, handleAnswer, handleIceCandidate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
    };
  }, []);

  return {
    remoteStreams,
    createAndSendOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeerConnection,
  };
};

export default useWebRTC;