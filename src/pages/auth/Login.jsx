import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'tutor') {
        navigate('/tutor');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      padding: 20
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: 1200 }}>
        <Col xs={24} md={12} lg={8}>
          <Card style={{ borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, color: '#1890ff' }}>
                Welcome Back
              </Title>
              <Text type="secondary">Sign in to your YouthInTech account</Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Sign In
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Don't have an account? </Text>
                <Link to="/register">
                  <Button type="link" style={{ padding: 0 }}>
                    Sign up now
                  </Button>
                </Link>
              </div>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link to="/forgot-password">
                  <Button type="link" size="small">
                    Forgot password?
                  </Button>
                </Link>
              </div>
            </Form>
          </Card>

          
        </Col>
      </Row>
    </div>
  );
};

export default Login;