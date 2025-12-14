import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tabs, List, Avatar, Button, Progress, Empty } from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import paymentApi from '../../api/paymentApi';
import meetingApi from '../../api/meetingApi';
import MeetingJoinCard from '../../components/student/MeetingJoinCard';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MyCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsData] = await Promise.all([
        paymentApi.getEnrollments ? paymentApi.getEnrollments() : paymentApi.checkSubscriptionStatus(),
      ]);

      setEnrollments(enrollmentsData);

      // Get meetings for enrolled courses
      const enrolledCourseIds = enrollmentsData.map(e => e.course?._id || e.course);
      if (enrolledCourseIds.length > 0) {
        const meetingsPromises = enrolledCourseIds.map(courseId =>
          meetingApi.getMeetingsByCourse(courseId)
        );
        const meetingsResults = await Promise.allSettled(meetingsPromises);
        const allMeetings = meetingsResults
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);
        setMeetings(allMeetings);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeTab === 'active') return enrollment.status === 'active';
    if (activeTab === 'completed') return enrollment.status === 'completed';
    if (activeTab === 'expired') return enrollment.status === 'expired';
    return true;
  });

  const getCourseProgress = (enrollment) => {
    // Simulate progress calculation
    return Math.floor(Math.random() * 100);
  };

  return (
    <div>
      <Title level={2}>My Courses</Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
        items={[
          {
            key: 'active',
            label: 'Active Courses',
            children: null,
          },
          {
            key: 'completed',
            label: 'Completed',
            children: null,
          },
          {
            key: 'expired',
            label: 'Expired',
            children: null,
          },
          {
            key: 'all',
            label: 'All Courses',
            children: null,
          },
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          {filteredEnrollments.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={filteredEnrollments}
              renderItem={enrollment => (
                <List.Item
                  extra={[
                    <Link to={`/student/course/${enrollment.course?._id || enrollment.course}`}>
                      <Button type="primary" icon={<PlayCircleOutlined />}>
                        Continue Learning
                      </Button>
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        icon={<BookOutlined />}
                        style={{ background: '#1890ff' }}
                      />
                    }
                    title={
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {enrollment.course?.title || 'Course'}
                        </Title>
                        <Text type="secondary">
                          Tutor: {enrollment.course?.tutor?.name || 'Unknown'}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Progress
                          percent={getCourseProgress(enrollment)}
                          style={{ margin: '8px 0' }}
                        />
                        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                          <div>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            <Text type="secondary">
                              Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                          <div>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            <Text type="secondary">
                              Expires: {new Date(enrollment.expiresAt).toLocaleDateString()}
                            </Text>
                          </div>
                          <div>
                            <DollarOutlined style={{ marginRight: 4 }} />
                            <Text type="secondary">
                              Paid: ${enrollment.amountPaid || 0}
                            </Text>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description={
                activeTab === 'active'
                  ? "You don't have any active courses. Explore courses to get started!"
                  : `No ${activeTab} courses found`
              }
              style={{ margin: '40px 0' }}
            >
              {activeTab === 'active' && (
                <Link to="/student/courses">
                  <Button type="primary">Explore Courses</Button>
                </Link>
              )}
            </Empty>
          )}
        </Col>

        <Col span={8}>
          <Card
            title="Upcoming Meetings"
            style={{ marginBottom: 24 }}
          >
            {meetings.length > 0 ? (
              <List
                dataSource={meetings.slice(0, 3)}
                renderItem={meeting => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<VideoCameraOutlined />} />}
                      title={
                        <Text strong style={{ fontSize: 14 }}>
                          {meeting.title}
                        </Text>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No upcoming meetings" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          <Card title="Learning Stats">
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>
                  {enrollments.filter(e => e.status === 'active').length}
                </Title>
                <Text type="secondary">Active Courses</Text>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>
                  {meetings.length}
                </Title>
                <Text type="secondary">Upcoming Meetings</Text>
              </div>

              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {Math.floor(enrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0))}
                </Title>
                <Text type="secondary">Total Spent (GHS)</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyCourses;