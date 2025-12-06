import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Typography, Row, Col, Card, List, Avatar } from 'antd';
import {
  BookOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'tutor') {
        navigate('/tutor');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: <BookOutlined />,
      title: 'Interactive Courses',
      description: 'Learn from comprehensive courses with video lessons, assignments, and quizzes.',
      color: '#1890ff',
    },
    {
      icon: <VideoCameraOutlined />,
      title: 'Live Meetings',
      description: 'Join live sessions with tutors for real-time learning and Q&A.',
      color: '#52c41a',
    },
    {
      icon: <TeamOutlined />,
      title: 'Expert Tutors',
      description: 'Learn from industry professionals with years of experience.',
      color: '#722ed1',
    },
    {
      icon: <CheckCircleOutlined />,
      title: 'Certification',
      description: 'Get certified upon course completion to boost your career.',
      color: '#faad14',
    },
  ];

  const stats = [
    { value: '500+', label: 'Courses Available' },
    { value: '10,000+', label: 'Students Enrolled' },
    { value: '200+', label: 'Expert Tutors' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Learn Anything, Anytime, Anywhere
        </Title>
        <Paragraph style={{ 
          fontSize: 20, 
          maxWidth: 800, 
          margin: '0 auto 40px',
          color: 'rgba(255,255,255,0.9)'
        }}>
          Join thousands of students learning from expert tutors through interactive courses and live sessions.
        </Paragraph>
        
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<RocketOutlined />}
            onClick={() => navigate('/register')}
            style={{ padding: '0 40px', height: 50, fontSize: 16 }}
          >
            Get Started Free
          </Button>
          <Button 
            size="large"
            onClick={() => navigate('/login')}
            style={{ padding: '0 40px', height: 50, fontSize: 16, background: 'rgba(255,255,255,0.1)', color: 'white' }}
          >
            Sign In
          </Button>
        </div>

        <Row gutter={[32, 32]} justify="center" style={{ maxWidth: 1000, margin: '0 auto' }}>
          {stats.map((stat, index) => (
            <Col key={index} xs={12} sm={6}>
              <div>
                <Title level={2} style={{ color: 'white', margin: 0 }}>{stat.value}</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
          Why Choose Our Platform
        </Title>
        
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  height: '100%',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  background: feature.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  {React.cloneElement(feature.icon, { style: { fontSize: 28, color: 'white' } })}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Text type="secondary">{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#fafafa',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <Title level={2} style={{ marginBottom: 16 }}>
          Ready to Start Learning?
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 40px' }}>
          Join our community of learners and unlock your potential with expert-led courses.
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          icon={<RocketOutlined />}
          onClick={() => navigate('/register')}
          style={{ padding: '0 50px', height: 50, fontSize: 16 }}
        >
          Start Free Trial
        </Button>
      </div>

      {/* Footer */}
      <div style={{
        background: '#001529',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
          © 2025 YouthInTech Platform. All rights reserved.
        </Paragraph>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16 }}>
          <Button type="link" style={{ color: 'rgba(255,255,255,0.8)' }}>Privacy Policy</Button>
          <Button type="link" style={{ color: 'rgba(255,255,255,0.8)' }}>Terms of Service</Button>
          <Button type="link" style={{ color: 'rgba(255,255,255,0.8)' }}>Contact Us</Button>
          <Button type="link" style={{ color: 'rgba(255,255,255,0.8)' }}>Help Center</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;