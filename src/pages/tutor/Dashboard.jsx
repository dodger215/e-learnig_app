// src/pages/tutor/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Button, Avatar, Tag, Progress } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  UserOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import courseApi from '../../api/courseApi';
import paymentApi from '../../api/paymentApi';
import meetingApi from '../../api/meetingApi';
import ScheduleMeetingModal from '../../components/tutor/ScheduleMeetingModal';

const { Title, Text } = Typography;

const TutorDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    upcomingMeetings: 0,
    walletBalance: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    setupSocketListeners();

    return () => {
      if (socket) {
        socket.off('earning_update');
      }
    };
  }, [socket]);

  const setupSocketListeners = () => {
    if (socket && user?._id) {
      socket.emit('join_personal', user._id);
      socket.emit('dashboard_subscribe', 'tutor');

      socket.on('earning_update', (data) => {
        setEarnings(prev => [{
          key: Date.now(),
          courseTitle: data.courseTitle,
          amount: data.amount,
          totalBalance: data.totalBalance,
          timestamp: new Date().toISOString(),
          message: data.message,
        }, ...prev.slice(0, 4)]);

        setStats(prev => ({
          ...prev,
          totalEarnings: prev.totalEarnings + data.amount,
          walletBalance: data.totalBalance,
        }));

        // Show notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('New Earning!', {
            body: data.message,
            icon: '/vite.svg',
          });
        }
      });
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [coursesData] = await Promise.all([
        courseApi.getCourses(),
      ]);

      const tutorCourses = coursesData.filter(course => course.tutor?._id === user?._id);

      let totalStudents = 0;
      let totalEarnings = 0;

      tutorCourses.forEach(course => {
        totalStudents += course.students?.length || 0;
        totalEarnings += (course.price || 0) * (course.students?.length || 0);
      });

      // Get tutor's meetings
      const allMeetings = [];
      for (const course of tutorCourses) {
        try {
          const courseMeetings = await meetingApi.getMeetingsByCourse(course._id);
          allMeetings.push(...courseMeetings);
        } catch (error) {
          console.error(`Failed to fetch meetings for course ${course._id}:`, error);
        }
      }

      setCourses(tutorCourses.slice(0, 3));
      setMeetings(allMeetings.slice(0, 3));

      setStats({
        totalCourses: tutorCourses.length,
        totalStudents,
        totalEarnings,
        upcomingMeetings: allMeetings.filter(m => new Date(m.startTime) > new Date()).length,
        walletBalance: user?.walletBalance || 0,
      });

      // Mock earnings data
      setEarnings([
        {
          key: 1,
          courseTitle: 'Web Development Bootcamp',
          amount: 149.99,
          totalBalance: 524.50,
          timestamp: '2024-01-15T10:30:00Z',
          message: 'Student enrollment',
        },
        {
          key: 2,
          courseTitle: 'Python for Beginners',
          amount: 79.99,
          totalBalance: 374.51,
          timestamp: '2024-01-14T14:20:00Z',
          message: 'Student enrollment',
        },
        {
          key: 3,
          courseTitle: 'Data Science Fundamentals',
          amount: 199.99,
          totalBalance: 294.52,
          timestamp: '2024-01-12T09:15:00Z',
          message: 'Student enrollment',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const earningsColumns = [
    {
      title: 'Course',
      dataIndex: 'courseTitle',
      key: 'courseTitle',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text type="success" strong>
          +${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Total Balance',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
      render: (balance) => `$${balance.toFixed(2)}`,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const meetingColumns = [
    {
      title: 'Meeting',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.course?.title || 'Course'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => new Date(time).toLocaleString(),
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
          return <Tag color="green">Live</Tag>;
        } else {
          return <Tag color="default">Completed</Tag>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
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
        return <Button size="small" disabled>View</Button>;
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Tutor Dashboard</Title>
        <Button
          type="primary"
          icon={<CalendarOutlined />}
          onClick={() => setShowScheduleModal(true)}
        >
          Schedule Meeting
        </Button>
      </div>

      {/* <Alert
        title={`Welcome back, ${user?.name}!`}
        description="Here's an overview of your teaching activities and earnings."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      /> */}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
            <Progress
              percent={Math.min(stats.totalCourses * 10, 100)}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
              <Text>+12% from last month</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={stats.totalEarnings}
              prefix={<DollarOutlined />}
              suffix="GHS"
              styles={{ content: { color: '#faad14' } }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
              <Text>+24% from last month</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Wallet Balance"
              value={stats.walletBalance}
              prefix={<RiseOutlined />}
              suffix="GHS"
              styles={{ content: { color: '#722ed1' } }}
            />
            <Button type="link" size="small" style={{ marginTop: 8, padding: 0 }}>
              Withdraw Funds
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            title="Recent Earnings"
            style={{ marginBottom: 24 }}
            extra={<Link to="/tutor/earnings"><Button type="link">View All</Button></Link>}
          >
            <Table
              columns={earningsColumns}
              dataSource={earnings}
              pagination={false}
              size="small"
            />
          </Card>

          <Card
            title="Upcoming Meetings"
            extra={<Link to="/tutor/meetings"><Button type="link">View All</Button></Link>}
          >
            <Table
              columns={meetingColumns}
              dataSource={meetings}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="My Courses"
            style={{ marginBottom: 24 }}
            extra={<Link to="/tutor/courses"><Button type="link">View All</Button></Link>}
          >
            {courses.length > 0 ? (
              courses.map(course => (
                <div
                  key={course._id}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <Avatar icon={<BookOutlined />} style={{ background: '#1890ff' }} />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block' }}>{course.title}</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {course.students?.length || 0} students
                      </Text>
                      <Tag color={course.isFree ? 'green' : 'blue'} size="small">
                        {course.isFree ? 'Free' : `$${course.price}`}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Text type="secondary">No courses yet</Text>
                <br />
                <Link to="/tutor/create-course">
                  <Button type="link" size="small">Create your first course</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card title="Quick Stats">
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>{stats.upcomingMeetings}</Title>
                <Text type="secondary">Upcoming Meetings</Text>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>{stats.totalStudents}</Title>
                <Text type="secondary">Total Students</Text>
              </div>

              <div>
                <Title level={3} style={{ margin: 0 }}>{courses.length}</Title>
                <Text type="secondary">Active Courses</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <ScheduleMeetingModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default TutorDashboard;