// src/pages/meeting/StudentMeetingRoom.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link import
import { Row, Col, Layout, Drawer, Typography, message, Modal, Alert } from 'antd';
import { MeetingProvider, useMeeting } from '../../contexts/MeetingContext';
import VideoConference from '../../components/meeting/VideoConference';
import ChatPanel from '../../components/meeting/ChatPanel';
import ParticipantsList from '../../components/meeting/ParticipantsList';
import ControlsBar from '../../components/meeting/ControlsBar';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const MeetingRoomContent = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  const { setLocalStream } = useMeeting();

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [waitingForHost, setWaitingForHost] = useState(true);
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
      // Get user media with lower quality for students
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setLocalStream(stream);

      // Join meeting via socket
      if (socket) {
        socket.emit('join_meeting', meetingId);
      }

      // Simulate meeting info
      setMeetingInfo({
        title: 'Live Class Session',
        tutor: 'John Smith',
        startedAt: new Date().toISOString(),
      });

      // Simulate waiting for host
      setTimeout(() => {
        setWaitingForHost(false);
        message.success('Tutor has joined the meeting');
      }, 3000);

    } catch (error) {
      console.error('Failed to initialize meeting:', error);
      message.error('Please allow camera and microphone access to join the meeting');
      navigate(-1);
    }
  };

  const cleanupMeeting = () => {
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
        navigate('/student');
      },
    });
  };

  return (
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
                {meetingInfo?.title || 'Class Session'}
              </Title>
              <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 4 }}>
                Tutor: {meetingInfo?.tutor || 'Loading...'} • Student: {user?.name}
              </div>
            </div>
            <div style={{ color: '#9aa0a6', fontSize: 14 }}>
              Student View
            </div>
          </div>
        </div>

        {waitingForHost && (
          <Alert
            title="Waiting for tutor to join..."
            description="The meeting will start once the tutor joins."
            type="info"
            showIcon
            style={{ margin: 16 }}
          />
        )}

        <Row style={{ height: 'calc(100vh - 160px)' }}>
          <Col span={showParticipants ? 18 : 24} style={{ padding: 16 }}>
            <VideoConference />

            <ControlsBar
              onToggleChat={() => setShowChat(!showChat)}
              onToggleParticipants={() => setShowParticipants(!showParticipants)}
              onLeaveMeeting={handleLeaveMeeting}
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
        title="Meeting Chat"
        placement="right"
        onClose={() => setShowChat(false)}
        open={showChat}
        width={350}
        bodyStyle={{ padding: 0 }}
      >
        <ChatPanel meetingId={meetingId} />
      </Drawer>
    </Layout>
  );
};

const StudentMeetingRoom = () => {
  return (
    <MeetingProvider>
      <MeetingRoomContent />
    </MeetingProvider>
  );
};

export default StudentMeetingRoom;