import { createContext, useContext, useState, useRef } from 'react';

const MeetingContext = createContext({});

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
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