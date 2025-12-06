import { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Avatar, Typography, Card } from 'antd';
import { SendOutlined, UserOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useMeeting } from '../../contexts/MeetingContext';
import { useSocket } from '../../contexts/SocketContext';

const { TextArea } = Input;
const { Text } = Typography;

const ChatPanel = ({ meetingId }) => {
  const { user } = useAuth();
  const { messages, addMessage } = useMeeting();
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (data) => {
        addMessage(data);
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, addMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const messageData = {
      meetingId,
      senderId: user._id,
      senderName: user.name,
      text: message,
      timestamp: new Date().toISOString(),
    };

    // Send via socket
    socket.emit('send_message', {
      ...messageData,
      courseId: meetingId, // Using meetingId as courseId for socket room
    });

    // Add to local state
    addMessage(messageData);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card
      title="Chat"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: 16,
        background: '#fafafa'
      }}>
        <List
          dataSource={messages}
          renderItem={(msg, index) => (
            <div
              style={{
                display: 'flex',
                flexDirection: msg.senderId === user._id ? 'row-reverse' : 'row',
                marginBottom: 12,
                alignItems: 'flex-end',
              }}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ 
                  margin: msg.senderId === user._id ? '0 0 0 8px' : '0 8px 0 0'
                }}
              />
              <div
                style={{
                  maxWidth: '70%',
                  background: msg.senderId === user._id ? '#1890ff' : '#f0f0f0',
                  color: msg.senderId === user._id ? 'white' : 'inherit',
                  padding: '8px 12px',
                  borderRadius: 18,
                  borderBottomRightRadius: msg.senderId === user._id ? 4 : 18,
                  borderBottomLeftRadius: msg.senderId === user._id ? 18 : 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: 12,
                      color: msg.senderId === user._id ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.45)'
                    }}
                  >
                    {msg.senderName}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 10,
                      marginLeft: 8,
                      color: msg.senderId === user._id ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)'
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
                <Text style={{ wordBreak: 'break-word' }}>
                  {msg.text}
                </Text>
              </div>
            </div>
          )}
        />
        <div ref={chatEndRef} />
      </div>

      <div style={{ 
        borderTop: '1px solid #f0f0f0', 
        padding: 16,
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="text" 
            icon={<PaperClipOutlined />}
            style={{ flexShrink: 0 }}
          />
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ flex: 1 }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={!message.trim()}
            style={{ flexShrink: 0 }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ChatPanel;