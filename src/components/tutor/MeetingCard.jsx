import { Card, Tag, Button, Typography, Space } from 'antd';
import { CalendarOutlined, TeamOutlined, ClockCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const MeetingCard = ({ meeting }) => {
  const startTime = new Date(meeting.startTime);
  const endTime = new Date(startTime.getTime() + meeting.duration * 60000);
  const now = new Date();

  const getStatus = () => {
    if (now < startTime) return { text: 'Upcoming', color: 'blue' };
    if (now >= startTime && now <= endTime) return { text: 'Live', color: 'green' };
    return { text: 'Completed', color: 'default' };
  };

  const status = getStatus();

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Button 
          type="primary" 
          icon={<VideoCameraOutlined />}
          disabled={now < startTime || now > endTime}
        >
          {now >= startTime && now <= endTime ? 'Join Meeting' : 'View Details'}
        </Button>
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={5} style={{ marginBottom: 8 }}>{meeting.title}</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            {meeting.description}
          </Text>
          
          <Space direction="vertical" size={4}>
            <div>
              <CalendarOutlined style={{ marginRight: 8 }} />
              <Text>{startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </div>
            <div>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              <Text>{meeting.duration} minutes</Text>
            </div>
            <div>
              <TeamOutlined style={{ marginRight: 8 }} />
              <Text>{meeting.participantsCount || 0} students invited</Text>
            </div>
          </Space>
        </div>
        
        <Tag color={status.color}>{status.text}</Tag>
      </div>
    </Card>
  );
};

export default MeetingCard;