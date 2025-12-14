// src/pages/student/MyMeetings.jsx
import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Typography, Empty, Row, Col, Alert, Divider } from 'antd';
import { 
  CalendarOutlined, 
  VideoCameraOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  BookOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import meetingApi from '../../api/meetingApi';
import courseApi from '../../api/courseApi';
import paymentApi from '../../api/paymentApi';

const { Title, Text } = Typography;

const MyMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      // Get enrolled courses first
      const enrollmentsData = await (paymentApi.getEnrollments ? paymentApi.getEnrollments() : paymentApi.checkSubscriptionStatus());
      const enrolledCourseIds = enrollmentsData.map(e => e.course?._id || e.course);
      
      // Get all courses to map course details
      const coursesData = await courseApi.getCourses();
      const enrolledCourses = coursesData.filter(course => 
        enrolledCourseIds.includes(course._id)
      );
      setEnrolledCourses(enrolledCourses);

      // Get meetings for all enrolled courses
      const allMeetings = [];
      for (const course of enrolledCourses) {
        try {
          const courseMeetings = await meetingApi.getMeetingsByCourse(course._id);
          allMeetings.push(...courseMeetings.map(m => ({ 
            ...m, 
            courseTitle: course.title,
            courseId: course._id,
            tutorName: course.tutor?.name || 'Tutor'
          })));
        } catch (error) {
          console.error(`Failed to fetch meetings for course ${course._id}:`, error);
        }
      }

      // Sort meetings by start time
      allMeetings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setMeetings(allMeetings);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingStatus = (meeting) => {
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(startTime.getTime() + meeting.duration * 60000);

    if (now < startTime) {
      return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'live', color: 'green', text: 'Live Now' };
    } else {
      return { status: 'completed', color: 'default', text: 'Completed' };
    }
  };

  const columns = [
    {
      title: 'Meeting',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            <BookOutlined style={{ marginRight: 4 }} />
            {record.courseTitle}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tutor',
      key: 'tutor',
      render: (_, record) => (
        <div>
          <UserOutlined style={{ marginRight: 4 }} />
          {record.tutorName}
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => (
        <div>
          <div>{new Date(time).toLocaleDateString()}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} minutes`,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getMeetingStatus(record);
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const status = getMeetingStatus(record);
        
        if (status.status === 'live') {
          return (
            <Link to={`/meeting/student/${record._id}`}>
              <Button type="primary" size="small" icon={<VideoCameraOutlined />}>
                Join Now
              </Button>
            </Link>
          );
        } else if (status.status === 'upcoming') {
          return (
            <Button size="small" disabled>
              Join at {new Date(record.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
          );
        }
        return (
          <Button size="small" disabled>
            Meeting Ended
          </Button>
        );
      },
    },
  ];

  const upcomingMeetings = meetings.filter(m => getMeetingStatus(m).status === 'upcoming');
  const liveMeetings = meetings.filter(m => getMeetingStatus(m).status === 'live');
  const pastMeetings = meetings.filter(m => getMeetingStatus(m).status === 'completed');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>My Meetings</Title>
        <Text type="secondary">
          View and join all your scheduled meetings from enrolled courses
        </Text>
      </div>

      <Alert
        message="Meeting Access"
        description="You can only join meetings for courses you are enrolled in. All meetings are scheduled by your course tutors."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {liveMeetings.length}
              </Title>
              <Text type="secondary">Live Now</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {upcomingMeetings.length}
              </Title>
              <Text type="secondary">Upcoming</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#8c8c8c' }}>
                {pastMeetings.length}
              </Title>
              <Text type="secondary">Completed</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {liveMeetings.length > 0 && (
        <>
          <Divider orientation="left">
            <Tag color="green">Live Now</Tag>
          </Divider>
          <Card style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={liveMeetings}
              loading={loading}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </>
      )}

      {upcomingMeetings.length > 0 && (
        <>
          <Divider orientation="left">
            <Tag color="blue">Upcoming Meetings</Tag>
          </Divider>
          <Card style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={upcomingMeetings}
              loading={loading}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}

      {pastMeetings.length > 0 && (
        <>
          <Divider orientation="left">
            <Tag color="default">Past Meetings</Tag>
          </Divider>
          <Card>
            <Table
              columns={columns}
              dataSource={pastMeetings}
              loading={loading}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}

      {meetings.length === 0 && !loading && (
        <Empty
          description={
            <div>
              <Title level={4} style={{ marginBottom: 8 }}>
                No meetings found
              </Title>
              <Text type="secondary">
                You don't have any scheduled meetings. Meetings will appear here once your tutors schedule them for your enrolled courses.
              </Text>
            </div>
          }
          style={{ margin: '40px 0' }}
        >
          <Link to="/student/my-courses">
            <Button type="primary">View My Courses</Button>
          </Link>
        </Empty>
      )}

      <Divider />

      <Card title="Need Help?" size="small">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><Text>Make sure you have a stable internet connection before joining a meeting</Text></li>
          <li><Text>Allow camera and microphone access when prompted</Text></li>
          <li><Text>Join meetings a few minutes early to test your audio/video</Text></li>
          <li><Text>Contact your tutor if you encounter any issues</Text></li>
        </ul>
      </Card>
    </div>
  );
};

export default MyMeetings;