import { Card, List, Avatar, Tag, Typography, Badge } from 'antd';
import { UserOutlined, AudioOutlined, AudioMutedOutlined, VideoCameraOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useMeeting } from '../../contexts/MeetingContext';

const { Text } = Typography;

const ParticipantsList = () => {
  const { user } = useAuth();
  const { participants, isAudioOn, isVideoOn } = useMeeting();

  const participantsWithSelf = [
    {
      id: 'self',
      name: `${user?.name} (You)`,
      isAudioOn,
      isVideoOn,
      isHost: true,
    },
    ...participants,
  ];

  return (
    <Card
      title={`Participants (${participantsWithSelf.length})`}
      style={{ height: '100%' }}
      bodyStyle={{ padding: 0 }}
    >
      <List
        dataSource={participantsWithSelf}
        renderItem={(participant) => (
          <List.Item
            style={{ 
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ position: 'relative', marginRight: 12 }}>
                <Avatar icon={<UserOutlined />} />
                <Badge 
                  dot 
                  status="success" 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0,
                    border: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <Text strong>{participant.name}</Text>
                {participant.isHost && (
                  <Tag color="blue" size="small" style={{ marginLeft: 8 }}>Host</Tag>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                {participant.isAudioOn ? (
                  <AudioOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <AudioMutedOutlined style={{ color: '#ff4d4f' }} />
                )}
                
                {participant.isVideoOn ? (
                  <VideoCameraOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <VideoCameraAddOutlined style={{ color: '#ff4d4f' }} />
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ParticipantsList;