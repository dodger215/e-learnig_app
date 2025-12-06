import { Card, Tag, Button, Typography, Progress, Avatar } from 'antd';
import { BookOutlined, TeamOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const CourseCard = ({ course }) => {
  const revenue = (course.price || 0) * (course.students?.length || 0);

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Link to={`/tutor/course/${course._id}`}>
          <Button type="link" icon={<EyeOutlined />}>Manage</Button>
        </Link>
      ]}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <Avatar 
          size={64} 
          icon={<BookOutlined />} 
          style={{ 
            backgroundColor: '#1890ff',
            flexShrink: 0
          }} 
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ marginBottom: 8 }}>{course.title}</Title>
            <Tag color={course.isFree ? 'green' : 'blue'}>
              {course.isFree ? 'FREE' : `$${course.price}`}
            </Tag>
          </div>
          
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {course.description?.substring(0, 100)}...
          </Text>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <TeamOutlined style={{ marginRight: 4 }} />
                <Text>{course.students?.length || 0} students</Text>
              </div>
              
              {!course.isFree && (
                <div>
                  <DollarOutlined style={{ marginRight: 4 }} />
                  <Text>${revenue} earned</Text>
                </div>
              )}
            </div>
            
            <Progress 
              percent={Math.min((course.students?.length || 0) * 10, 100)} 
              size="small" 
              style={{ width: 100 }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;