import { Component } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          padding: 20
        }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle={this.props.message || "An unexpected error occurred. Please try again."}
            extra={[
              <Button 
                type="primary" 
                key="home" 
                icon={<HomeOutlined />} 
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>,
              <Button 
                key="reload" 
                icon={<ReloadOutlined />} 
                onClick={this.handleReload}
              >
                Reload Page
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;