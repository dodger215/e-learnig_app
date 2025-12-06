import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Typography, Tabs, Table, Button, Tag, Avatar, Statistic, Progress, List, Empty } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  UserOutlined,
  MessageOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import * as courseApi from '../../api/courseApi';
import * as meetingApi from '../../api/meetingApi';
import ScheduleMeetingModal from '../../components/tutor/ScheduleMeetingModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TutorCourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseData] = await Promise.all([
        courseApi.getCourseById ? courseApi.getCourseById(id) : Promise.resolve(null),
      ]);

      if (courseData) {
        setCourse(courseData);
        
        // Get meetings for this course
        const meetingsData = await meetingApi.getMeetingsByCourse(id);
        setMeetings(meetingsData);

        // Mock students data
        setStudents([
          { id: 1, name: 'John Doe', email: 'john@example.com', enrolledDate: '2024-01-15', progress: 75 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledDate: '2024-01-14', progress: 45 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', enrolledDate: '2024-01-12', progress: 90 },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', enrolledDate: '2024-01-10', progress: 30 },
          { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', enrolledDate: '2024-01-08', progress: 60 },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const studentColumns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Enrolled Date',
      dataIndex: 'enrolledDate',
      key: 'enrolledDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress percent={progress} size="small" style={{ width: 100 }} />
          <Text>{progress}%</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<MessageOutlined />} size="small">
          Message
        </Button>
      ),
    },
  ];

  const meetingColumns = [
    {
      title: 'Meeting',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>,
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
      title: 'Participants',
      key: 'participants',
      render: () => <Text>12/25</Text>,
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
        return <Button size="small">View Details</Button>;
      },
    },
  ];

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 40,
        borderRadius: 8,
        marginBottom: 24,
        color: 'white'
      }}>
        <Row gutter={[32, 16]} align="middle">
          <Col span={18}>
            <Tag color={course.isFree ? 'green' : 'blue'} style={{ marginBottom: 16, background: 'rgba(255,255,255,0.2)' }}>
              {course.isFree ? 'FREE COURSE' : `$${course.price}`}
            </Tag>
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              {course.title}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              {course.description}
            </Text>
            
            <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
              <div>
                <TeamOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: 'white' }}>{course.students?.length || 0} Students</Text>
              </div>
              <div>
                <DollarOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: 'white' }}>
                  ${((course.price || 0) * (course.students?.length || 0)).toFixed(2)} Revenue
                </Text>
              </div>
              <div>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: 'white' }}>
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </Col>
          
          <Col span={6}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<CalendarOutlined />}
                onClick={() => setShowScheduleModal(true)}
              >
                Schedule Meeting
              </Button>
              <Button icon={<SettingOutlined />}>
                Settings
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card title="Course Statistics">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="Total Students"
                      value={course.students?.length || 0}
                      prefix={<TeamOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Total Revenue"
                      value={((course.price || 0) * (course.students?.length || 0)).toFixed(2)}
                      prefix={<DollarOutlined />}
                      suffix="GHS"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Completion Rate"
                      value="78"
                      suffix="%"
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="Recent Meetings" style={{ marginTop: 24 }}>
                {meetings.length > 0 ? (
                  <Table
                    columns={meetingColumns}
                    dataSource={meetings.slice(0, 5)}
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <Empty description="No meetings scheduled yet">
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Schedule First Meeting
                    </Button>
                  </Empty>
                )}
              </Card>
            </Col>
            
            <Col span={8}>
              <Card title="Student Progress">
                {students.length > 0 ? (
                  <List
                    dataSource={students}
                    renderItem={student => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={student.name}
                          description={
                            <Progress percent={student.progress} size="small" />
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No students enrolled yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card>

              <Card title="Quick Actions" style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Button icon={<VideoCameraOutlined />} onClick={() => setShowScheduleModal(true)}>
                    Schedule Meeting
                  </Button>
                  <Button icon={<MessageOutlined />}>
                    Message All Students
                  </Button>
                  <Button icon={<SettingOutlined />}>
                    Course Settings
                  </Button>
                  <Button icon={<BookOutlined />}>
                    Add Content
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="Students" key="students">
          <Card>
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Meetings" key="meetings">
          <Card
            title="All Meetings"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setShowScheduleModal(true)}
              >
                New Meeting
              </Button>
            }
          >
            {meetings.length > 0 ? (
              <Table
                columns={meetingColumns}
                dataSource={meetings}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <Empty description="No meetings scheduled yet">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowScheduleModal(true)}
                >
                  Schedule First Meeting
                </Button>
              </Empty>
            )}
          </Card>
        </TabPane>
        
        <TabPane tab="Content" key="content">
          <Card title="Course Content">
            <Empty description="Add course content modules here" />
          </Card>
        </TabPane>
        
        <TabPane tab="Analytics" key="analytics">
          <Card title="Course Analytics">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Title level={4}>Engagement Rate</Title>
                  <Progress type="circle" percent={78} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Title level={4}>Student Satisfaction</Title>
                  <Progress type="circle" percent={92} status="success" />
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      <ScheduleMeetingModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => {
          fetchCourseDetails();
        }}
      />
    </div>
  );
};

export default TutorCourseDetails;