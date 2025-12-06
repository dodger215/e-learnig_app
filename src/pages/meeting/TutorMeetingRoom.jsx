// src/pages/meeting/TutorMeetingRoom.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Layout, Drawer, Typography, message, Modal } from 'antd';
import { MeetingProvider } from '../../contexts/MeetingContext';
import VideoConference from '../../components/meeting/VideoConference';
import ChatPanel from '../../components/meeting/ChatPanel';
import ParticipantsList from '../../components/meeting/ParticipantsList';
import ControlsBar from '../../components/meeting/ControlsBar';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const { Content } = Layout;
const { Title } = Typography;

const TutorMeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    initializeMeeting();
    
    return () => {
      cleanupMeeting();
    };
  }, []);

  const initializeMeeting = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      });
      
      setLocalStream(stream);

      // Join meeting via socket
      if (socket) {
        socket.emit('join_meeting', meetingId);
      }

      // Simulate fetching meeting info
      setMeetingInfo({
        title: 'Tutor Meeting Session',
        participants: 5,
        duration: 60,
      });

      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

    } catch (error) {
      console.error('Failed to initialize meeting:', error);
      message.error('Failed to access camera/microphone');
      navigate(-1);
    }
  };

  const cleanupMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (socket) {
      socket.emit('leave_meeting', meetingId);
    }
  };

  const handleLeaveMeeting = () => {
    Modal.confirm({
      title: 'Leave Meeting',
      content: 'Are you sure you want to leave the meeting?',
      okText: 'Leave',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        cleanupMeeting();
        navigate('/tutor');
      },
    });
  };

  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Replace video track with screen share
      const videoTrack = screenStream.getVideoTracks()[0];
      
      // Listen for when screen sharing stops
      videoTrack.onended = () => {
        message.info('Screen sharing stopped');
      };

      message.success('Screen sharing started');
    } catch (error) {
      console.error('Screen sharing failed:', error);
      message.error('Failed to share screen');
    }
  };

  return (
    <MeetingProvider>
      <Layout style={{ minHeight: '100vh', background: '#202124' }}>
        <Content style={{ padding: 0 }}>
          <div style={{ 
            background: '#202124',
            padding: 16,
            borderBottom: '1px solid #3c4043'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: 'white'
            }}>
              <div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  {meetingInfo?.title || 'Meeting Room'}
                </Title>
                <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 4 }}>
                  Meeting ID: {meetingId} • {meetingInfo?.participants || 0} participants
                </div>
              </div>
              <div style={{ color: '#9aa0a6', fontSize: 14 }}>
                {user?.name} (Host)
              </div>
            </div>
          </div>

          <Row style={{ height: 'calc(100vh - 120px)' }}>
            <Col span={showParticipants ? 18 : 24} style={{ padding: 16 }}>
              <VideoConference />
              
              <ControlsBar
                onToggleChat={() => setShowChat(!showChat)}
                onToggleParticipants={() => setShowParticipants(!showParticipants)}
                onLeaveMeeting={handleLeaveMeeting}
                onScreenShare={handleScreenShare}
              />
            </Col>

            {showParticipants && (
              <Col span={6} style={{ padding: 16, paddingLeft: 0 }}>
                <ParticipantsList />
              </Col>
            )}
          </Row>
        </Content>

        <Drawer
          title="Chat"
          placement="right"
          onClose={() => setShowChat(false)}
          open={showChat}
          width={350}
          bodyStyle={{ padding: 0 }}
        >
          <ChatPanel meetingId={meetingId} />
        </Drawer>
      </Layout>
    </MeetingProvider>
  );
};

export default TutorMeetingRoom;