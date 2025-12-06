import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Table, Tag, Avatar, Progress, Empty } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as courseApi from '../../api/courseApi';

const { Title, Text } = Typography;

const TutorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesData = await courseApi.getCourses();
      const tutorCourses = coursesData.filter(course => course.tutor?._id === user?._id);
      setCourses(tutorCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Course',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar icon={<BookOutlined />} style={{ background: '#1890ff' }} />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <Tag color={record.isFree ? 'green' : 'blue'}>
          {record.isFree ? 'FREE' : `$${price}`}
        </Tag>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (students) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TeamOutlined />
          <Text>{students?.length || 0}</Text>
        </div>
      ),
    },
    {
      title: 'Revenue',
      key: 'revenue',
      render: (_, record) => (
        <Text strong>${((record.price || 0) * (record.students?.length || 0)).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/tutor/course/${record._id}`}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
          <Button icon={<EditOutlined />} size="small" />
          <Button icon={<DeleteOutlined />} size="small" danger />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>My Courses</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Create New Course
        </Button>
      </div>

      <Card>
        {courses.length > 0 ? (
          <Table
            columns={columns}
            dataSource={courses}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty
            description={
              <div>
                <Title level={4} style={{ marginBottom: 16 }}>No courses yet</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                  Create your first course to start teaching students
                </Text>
                <Button type="primary" icon={<PlusOutlined />} size="large">
                  Create Your First Course
                </Button>
              </div>
            }
            style={{ padding: 40 }}
          />
        )}
      </Card>

      <Card title="Course Analytics" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                {courses.length}
              </Title>
              <Text type="secondary">Total Courses</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                {courses.reduce((sum, course) => sum + (course.students?.length || 0), 0)}
              </Title>
              <Text type="secondary">Total Students</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                ${courses.reduce((sum, course) => sum + ((course.price || 0) * (course.students?.length || 0)), 0).toFixed(2)}
              </Title>
              <Text type="secondary">Total Revenue</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TutorCourses;