import { useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, Button, Empty } from 'antd';
import { CalendarOutlined, VideoCameraOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import courseApi from '../../api/courseApi';
import meetingApi from '../../api/meetingApi';
import ScheduleMeetingModal from '../../components/tutor/ScheduleMeetingModal';

const { Title, Text } = Typography;

const ScheduleMeeting = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData] = await Promise.all([
        courseApi.getCourses(),
      ]);

      const tutorCourses = coursesData.filter(course => course.tutor?._id === user?._id);
      setCourses(tutorCourses);

      // Get all meetings for tutor's courses
      const allMeetings = [];
      for (const course of tutorCourses) {
        try {
          const courseMeetings = await meetingApi.getMeetingsByCourse(course._id);
          allMeetings.push(...courseMeetings.map(m => ({ ...m, courseTitle: course.title })));
        } catch (error) {
          console.error(`Failed to fetch meetings for course ${course._id}:`, error);
        }
      }

      setMeetings(allMeetings);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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
            Course: {record.courseTitle}
          </Text>
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
        const now = new Date();
        const startTime = new Date(record.startTime);
        const endTime = new Date(startTime.getTime() + record.duration * 60000);

        if (now < startTime) {
          return <Tag color="blue">Upcoming</Tag>;
        } else if (now >= startTime && now <= endTime) {
          return <Tag color="green">Live Now</Tag>;
        } else {
          return <Tag color="default">Completed</Tag>;
        }
      },
    },
    {
      title: 'Participants',
      key: 'participants',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <UserOutlined />
          <Text>12/25</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const now = new Date();
        const startTime = new Date(record.startTime);
        const endTime = new Date(startTime.getTime() + record.duration * 60000);

        if (now >= startTime && now <= endTime) {
          return (
            <Link to={`/meeting/tutor/${record._id}`}>
              <Button type="primary" size="small" icon={<VideoCameraOutlined />}>
                Join
              </Button>
            </Link>
          );
        }
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small">Edit</Button>
            <Button size="small" danger>Cancel</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Schedule & Manage Meetings</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowScheduleModal(true)}
          size="large"
        >
          Schedule New Meeting
        </Button>
      </div>

      <Card
        title="Upcoming Meetings"
        style={{ marginBottom: 24 }}
      >
        {meetings.length > 0 ? (
          <Table
            columns={columns}
            dataSource={meetings.filter(m => new Date(m.startTime) > new Date())}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="No upcoming meetings">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule Your First Meeting
            </Button>
          </Empty>
        )}
      </Card>

      <Card title="Past Meetings">
        {meetings.filter(m => new Date(m.startTime) <= new Date()).length > 0 ? (
          <Table
            columns={columns}
            dataSource={meetings.filter(m => new Date(m.startTime) <= new Date())}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="No past meetings" />
        )}
      </Card>

      <ScheduleMeetingModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};

export default ScheduleMeeting;