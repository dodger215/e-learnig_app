// src/components/common/LoadingSpinner.jsx
import { Spin } from 'antd';

const LoadingSpinner = ({ size = 'large', tip = 'Loading...', fullPage = false }) => {
  const spinner = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      padding: fullPage ? '40px 0' : '20px 0'
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;