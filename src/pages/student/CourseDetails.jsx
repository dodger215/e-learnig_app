import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, Tabs, List, Tag, Progress, Rate, Avatar, Divider, Alert } from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import courseApi from '../../api/courseApi';
import paymentApi from '../../api/paymentApi';
import meetingApi from '../../api/meetingApi';
import MeetingJoinCard from '../../components/student/MeetingJoinCard';
import PaymentModal from '../../components/student/PaymentModal';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StudentCourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState({ visible: false, course: null });

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseData, enrollmentsData] = await Promise.all([
        courseApi.getCourseById ? courseApi.getCourseById(id) : Promise.resolve(null),
        paymentApi.getEnrollments ? paymentApi.getEnrollments() : paymentApi.checkSubscriptionStatus(),
      ]);

      if (courseData) {
        setCourse(courseData);

        // Check if enrolled
        const userEnrollment = enrollmentsData.find(
          e => (e.course?._id === id || e.course === id) && e.status === 'active'
        );
        setIsEnrolled(!!userEnrollment);
        setEnrollment(userEnrollment || null);

        // Get meetings
        if (userEnrollment) {
          const meetingsData = await meetingApi.getMeetingsByCourse(id);
          setMeetings(meetingsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (course.isFree) {
      paymentApi.enrollFree(course._id)
        .then(() => {
          fetchCourseDetails();
        })
        .catch(error => {
          console.error('Enrollment failed:', error);
        });
    } else {
      setPaymentModal({ visible: true, course });
    }
  };

  const modules = [
    { id: 1, title: 'Introduction to Course', duration: '30 min', completed: true },
    { id: 2, title: 'Setting Up Development Environment', duration: '45 min', completed: true },
    { id: 3, title: 'Core Concepts and Fundamentals', duration: '2 hours', completed: false },
    { id: 4, title: 'Advanced Topics', duration: '3 hours', completed: false },
    { id: 5, title: 'Project Work', duration: '5 hours', completed: false },
    { id: 6, title: 'Final Assessment', duration: '1 hour', completed: false },
  ];

  const resources = [
    { id: 1, title: 'Course Syllabus PDF', type: 'pdf', size: '2.4 MB' },
    { id: 2, title: 'Code Examples Zip', type: 'zip', size: '15.2 MB' },
    { id: 3, title: 'Reference Materials', type: 'doc', size: '5.7 MB' },
    { id: 4, title: 'Project Templates', type: 'zip', size: '8.9 MB' },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;
  }

  if (!course) {
    return <Alert type="error" title="Course not found" />;
  }

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
          <Col span={16}>
            <Tag color={course.isFree ? 'green' : 'blue'} style={{ marginBottom: 16 }}>
              {course.isFree ? 'FREE' : `$${course.price}`}
            </Tag>
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              {course.title}
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 24 }}>
              {course.description}
            </Paragraph>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ color: 'white', display: 'block' }}>
                    {course.tutor?.name || 'Tutor'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    Instructor
                  </Text>
                </div>
              </div>

              <div>
                <Rate disabled defaultValue={4.5} style={{ color: '#ffd700' }} />
                <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 8 }}>
                  4.5 (128 reviews)
                </Text>
              </div>

              <div>
                <Text strong style={{ color: 'white', display: 'block' }}>
                  {course.students?.length || 0}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  Students Enrolled
                </Text>
              </div>
            </div>
          </Col>

          <Col span={8}>
            <Card style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <div style={{ textAlign: 'center' }}>
                {isEnrolled ? (
                  <>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                    <Title level={4} style={{ color: 'white', marginBottom: 8 }}>
                      You are enrolled!
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 16 }}>
                      Access expires: {enrollment ? new Date(enrollment.expiresAt).toLocaleDateString() : 'N/A'}
                    </Text>
                    <Link to={`/student/course/${id}/learn`}>
                      <Button type="primary" size="large" icon={<PlayCircleOutlined />} block>
                        Continue Learning
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Title level={3} style={{ color: 'white', marginBottom: 16 }}>
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </Title>
                    <Button
                      type="primary"
                      size="large"
                      icon={course.isFree ? <PlayCircleOutlined /> : <DollarOutlined />}
                      onClick={handleEnroll}
                      block
                      style={{ marginBottom: 16 }}
                    >
                      {course.isFree ? 'Enroll for Free' : 'Enroll Now'}
                    </Button>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                      30-day money-back guarantee
                    </Text>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="overview" style={{ marginBottom: 24 }}>
        <TabPane tab="Overview" key="overview">
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card title="What you'll learn">
                <ul style={{ paddingLeft: 20 }}>
                  <li>Master the fundamentals of the subject</li>
                  <li>Build real-world projects from scratch</li>
                  <li>Learn best practices and industry standards</li>
                  <li>Get personalized feedback from instructor</li>
                  <li>Join live sessions and Q&A meetings</li>
                </ul>
              </Card>

              <Card title="Course Content" style={{ marginTop: 24 }}>
                <List
                  dataSource={modules}
                  renderItem={module => (
                    <List.Item
                      actions={[
                        <Button type="link" icon={<PlayCircleOutlined />}>
                          {module.completed ? 'Review' : 'Start'}
                        </Button>
                      ]}
                      style={{ borderBottom: '1px solid #f0f0f0' }}
                    >
                      <List.Item.Meta
                        avatar={
                          module.completed ? (
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                          ) : (
                            <ClockCircleOutlined style={{ color: '#bfbfbf', fontSize: 20 }} />
                          )
                        }
                        title={module.title}
                        description={
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">{module.duration}</Text>
                            {module.completed && (
                              <Tag color="green">Completed</Tag>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Course Details">
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>Duration</Text>
                  <Text type="secondary">{course.duration || 30} days access</Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>Level</Text>
                  <Text type="secondary">Beginner to Intermediate</Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>Prerequisites</Text>
                  <Text type="secondary">Basic computer knowledge</Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>Certificate</Text>
                  <Text type="secondary">Certificate of completion included</Text>
                </div>
              </Card>

              <Card title="Resources" style={{ marginTop: 24 }}>
                <List
                  dataSource={resources}
                  renderItem={resource => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<FileTextOutlined />}
                        title={resource.title}
                        description={`${resource.type.toUpperCase()} • ${resource.size}`}
                      />
                      <Button icon={<DownloadOutlined />} size="small" />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Meetings" key="meetings">
          {isEnrolled ? (
            meetings.length > 0 ? (
              meetings.map(meeting => (
                <MeetingJoinCard
                  key={meeting._id}
                  meeting={meeting}
                  course={course}
                />
              ))
            ) : (
              <Empty description="No meetings scheduled for this course yet" />
            )
          ) : (
            <Alert
              title="Enroll to access meetings"
              description="You need to enroll in this course to view and join scheduled meetings."
              type="info"
              showIcon
            />
          )}
        </TabPane>

        <TabPane tab="Instructor" key="instructor">
          <Card>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <div style={{ flex: 1 }}>
                <Title level={4}>{course.tutor?.name || 'Tutor Name'}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                  Senior Instructor • 5+ years experience
                </Text>
                <Paragraph>
                  With over 5 years of teaching experience and industry expertise,
                  {course.tutor?.name || 'the tutor'} has helped thousands of students
                  master new skills. Passionate about education and student success.
                </Paragraph>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Title level={3} style={{ margin: 0 }}>4.8</Title>
                      <Text type="secondary">Instructor Rating</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Title level={3} style={{ margin: 0 }}>1,250+</Title>
                      <Text type="secondary">Students</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Title level={3} style={{ margin: 0 }}>15</Title>
                      <Text type="secondary">Courses</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      <PaymentModal
        visible={paymentModal.visible}
        course={paymentModal.course}
        onClose={() => setPaymentModal({ visible: false, course: null })}
        onSuccess={() => {
          fetchCourseDetails();
        }}
      />
    </div>
  );
};

export default StudentCourseDetails;