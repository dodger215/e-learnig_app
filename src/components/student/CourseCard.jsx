import { Card, Tag, Button, Typography, Avatar, Rate } from 'antd';
import { BookOutlined, UserOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const CourseCard = ({ course, onEnroll, isEnrolled = false }) => {
  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          height: 160, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}>
          <BookOutlined style={{ fontSize: 48, color: 'white' }} />
          {isEnrolled && (
            <Tag color="green" style={{ position: 'absolute', top: 8, right: 8 }}>
              Enrolled
            </Tag>
          )}
        </div>
      }
      actions={[
        <Link to={`/student/course/${course._id}`}>
          <Button type="link" icon={<EyeOutlined />}>View Details</Button>
        </Link>,
        <Button
          type={isEnrolled ? 'default' : course.isFree ? 'default' : 'primary'}
          icon={course.isFree ? <EyeOutlined /> : <ShoppingCartOutlined />}
          onClick={() => onEnroll(course)}
          disabled={isEnrolled}
        >
          {isEnrolled ? 'Enrolled' : course.isFree ? 'Enroll Free' : `Enroll $${course.price}`}
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ margin: 0 }}>{course.title}</Title>
            <Tag color={course.isFree ? 'green' : 'blue'}>
              {course.isFree ? 'Free' : `$${course.price}`}
            </Tag>
          </div>
        }
        description={
          <div>
            <Text ellipsis style={{ display: 'block', marginBottom: 12 }}>
              {course.description?.substring(0, 120)}...
            </Text>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text type="secondary">{course.tutor?.name}</Text>
              </div>
              
              <Rate 
                disabled 
                defaultValue={4.5} 
                style={{ fontSize: 14 }} 
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">
                {course.students?.length || 0} students enrolled
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default CourseCard;