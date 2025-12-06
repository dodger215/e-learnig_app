// src/components/common/Layout.jsx
import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  VideoCameraOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const LayoutComponent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  // Student menu items
  const studentMenuItems = [
    {
      key: '/student',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/student/courses',
      icon: <BookOutlined />,
      label: 'Explore Courses',
    },
    {
      key: '/student/my-courses',
      icon: <TeamOutlined />,
      label: 'My Courses',
    },
    {
      key: '/student/meetings',
      icon: <VideoCameraOutlined />,
      label: 'My Meetings',
    },
  ];

  // Tutor menu items
  const tutorMenuItems = [
    {
      key: '/tutor',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/tutor/courses',
      icon: <BookOutlined />,
      label: 'My Courses',
    },
    {
      key: '/tutor/meetings',
      icon: <VideoCameraOutlined />,
      label: 'My Meetings',
    },
    {
      key: '/tutor/schedule-meeting',
      icon: <ScheduleOutlined />,
      label: 'Schedule Meeting',
    },
  ];

  const menuItems = user?.role === 'student' ? studentMenuItems : tutorMenuItems;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="80"
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        <div className="logo" style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#001529',
          overflow: 'hidden'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Title level={4} style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: collapsed ? 14 : 12,
              whiteSpace: 'nowrap',
              padding: collapsed ? 0 : '0 16px'
            }}>
              {collapsed ? 'YEP' : 'YouthInTech E-Learning Platform'}
            </Title>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
          style={{
            height: 'calc(100vh - 64px)',
            borderRight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        />
      </Sider>
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 200,
        transition: 'margin-left 0.2s',
        minHeight: '100vh',
      }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          height: 64,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 48, height: 48 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 500 }}>{user?.name} - {user?.role === 'student' ? 'Student' : 'Tutor'}</div>
              {/* <div style={{ fontSize: 12, color: '#666' }}>
                {user?.role === 'student' ? 'Student' : 'Tutor'}
              </div> */}
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  cursor: 'pointer',
                  background: '#1890ff'
                }} 
              />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          padding: 24, 
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 8,
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;