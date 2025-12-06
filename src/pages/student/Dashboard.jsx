// src/pages/student/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Typography, Button, Progress, Alert, Empty } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as courseApi from '../../api/courseApi';
import * as paymentApi from '../../api/paymentApi';
import * as meetingApi from '../../api/meetingApi';
import CourseCard from '../../components/student/CourseCard';
import MeetingJoinCard from '../../components/student/MeetingJoinCard';
import PaymentModal from '../../components/student/PaymentModal';

const { Title, Text } = Typography;

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState({ visible: false, course: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        courseApi.getCourses(),
        paymentApi.getEnrollments ? paymentApi.getEnrollments() : paymentApi.checkSubscriptionStatus(),
      ]);
      
      setCourses(coursesData.slice(0, 3));
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
        setMeetings(allMeetings.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course) => {
    if (course.isFree) {
      paymentApi.enrollFree(course._id)
        .then(() => {
          fetchDashboardData();
        })
        .catch(error => {
          console.error('Enrollment failed:', error);
        });
    } else {
      setPaymentModal({ visible: true, course });
    }
  };

  const isCourseEnrolled = (courseId) => {
    return enrollments.some(e => e.course?._id === courseId || e.course === courseId);
  };

  const stats = {
    enrolledCourses: enrollments.length,
    activeCourses: enrollments.filter(e => e.status === 'active').length,
    totalMeetings: meetings.length,
    totalSpent: enrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0),
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Student Dashboard</Title>
        <Text type="secondary">Welcome back, {user?.name}!</Text>
      </div>

      <Alert
        message="Your Learning Journey"
        description="Track your progress, access courses, and join live sessions from here."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Enrolled Courses"
              value={stats.enrolledCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Courses"
              value={stats.activeCourses}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Upcoming Meetings"
              value={stats.totalMeetings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              prefix={<DollarOutlined />}
              suffix="GHS"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        <Col span={16}>
          <Card
            title="Recommended Courses"
            extra={<Link to="/student/courses"><Button type="link">View All <RightOutlined /></Button></Link>}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              {courses.map(course => (
                <Col span={8} key={course._id}>
                  <CourseCard
                    course={course}
                    isEnrolled={isCourseEnrolled(course._id)}
                    onEnroll={handleEnroll}
                  />
                </Col>
              ))}
              {courses.length === 0 && (
                <Col span={24}>
                  <Empty description="No courses available" />
                </Col>
              )}
            </Row>
          </Card>

          <Card
            title="Upcoming Meetings"
            extra={<Link to="/student/meetings"><Button type="link">View All <RightOutlined /></Button></Link>}
          >
            {meetings.length > 0 ? (
              meetings.map(meeting => (
                <MeetingJoinCard 
                  key={meeting._id} 
                  meeting={meeting}
                  course={courses.find(c => c._id === meeting.course)}
                />
              ))
            ) : (
              <Empty description="No upcoming meetings" />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Active Enrollments"
            style={{ marginBottom: 24 }}
          >
            {enrollments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={enrollments.slice(0, 5)}
                renderItem={enrollment => (
                  <List.Item
                    actions={[
                      <Link to={`/student/course/${enrollment.course?._id || enrollment.course}`}>
                        <Button type="link" size="small">Open</Button>
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<BookOutlined />} />}
                      title={enrollment.course?.title || 'Course'}
                      description={
                        <div>
                          <Text type="secondary">Expires: {new Date(enrollment.expiresAt).toLocaleDateString()}</Text>
                          <Progress
                            percent={Math.floor(
                              (Date.now() - new Date(enrollment.createdAt).getTime()) / 
                              (new Date(enrollment.expiresAt).getTime() - new Date(enrollment.createdAt).getTime()) * 100
                            )}
                            size="small"
                            style={{ marginTop: 8 }}
                          />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No active enrollments" />
            )}
          </Card>

          <Card title="Recent Activity">
            <List
              size="small"
              dataSource={[
                { action: 'Enrolled in Web Development Course', time: '2 hours ago' },
                { action: 'Joined Live Python Class', time: '1 day ago' },
                { action: 'Completed Assignment #3', time: '3 days ago' },
                { action: 'Purchased Data Science Course', time: '1 week ago' },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size="small" icon={<ClockCircleOutlined />} />}
                    title={<Text style={{ fontSize: 12 }}>{item.action}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 10 }}>{item.time}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <PaymentModal
        visible={paymentModal.visible}
        course={paymentModal.course}
        onClose={() => setPaymentModal({ visible: false, course: null })}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default StudentDashboard;