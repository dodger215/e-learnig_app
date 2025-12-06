import { Card, Button, Typography, Tag, Avatar } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, VideoCameraOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const MeetingJoinCard = ({ meeting, course }) => {
  const startTime = new Date(meeting.startTime);
  const endTime = new Date(startTime.getTime() + meeting.duration * 60000);
  const now = new Date();

  const canJoin = now >= startTime && now <= endTime;
  const isUpcoming = now < startTime;
  const isPast = now > endTime;

  const getStatus = () => {
    if (isPast) return { text: 'Completed', color: 'default' };
    if (canJoin) return { text: 'Live Now', color: 'green' };
    if (isUpcoming) return { text: 'Upcoming', color: 'blue' };
    return { text: 'Scheduled', color: 'orange' };
  };

  const status = getStatus();

  return (
    <Card
      style={{ marginBottom: 16 }}
      actions={[
        <Button 
          type="primary" 
          icon={<VideoCameraOutlined />}
          disabled={!canJoin}
          block
        >
          {canJoin ? 'Join Meeting' : isUpcoming ? 'Not Started Yet' : 'Meeting Ended'}
        </Button>
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginBottom: 4 }}>{meeting.title}</Title>
          {course && (
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              Course: {course.title}
            </Text>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CalendarOutlined />
              <Text>{startTime.toLocaleDateString()}</Text>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockCircleOutlined />
              <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Text>-</Text>
              <Text>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TeamOutlined />
              <Text>Tutor: {meeting.host?.name || 'Tutor'}</Text>
            </div>
          </div>
        </div>
        
        <Tag color={status.color}>{status.text}</Tag>
      </div>
      
      <Text type="secondary" style={{ display: 'block' }}>
        {meeting.description || 'No description provided'}
      </Text>
      
      {canJoin && meeting.meetingLink && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to={meeting.meetingLink.replace('localhost:5173', window.location.host)}>
            <Button type="primary" size="large">
              <VideoCameraOutlined /> Enter Meeting Room
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default MeetingJoinCard;