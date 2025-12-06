import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/antd-theme.css';
import './styles/custom.css';

// Import Ant Design CSS
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);