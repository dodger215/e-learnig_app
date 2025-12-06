// src/components/meeting/ControlsBar.jsx
import { Button, Space, Dropdown, Menu } from 'antd';
import {
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  MoreOutlined,
  UserAddOutlined,
  SettingOutlined,
  ExpandOutlined,
  MessageOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useMeeting } from '../../contexts/MeetingContext';

const ControlsBar = ({ onToggleChat, onToggleParticipants, onLeaveMeeting, onScreenShare }) => {
  const { isVideoOn, isAudioOn, toggleVideo, toggleAudio, toggleScreenShare, isScreenSharing } = useMeeting();

  const moreMenu = (
    <Menu
      items={[
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
        },
        {
          key: 'invite',
          icon: <UserAddOutlined />,
          label: 'Invite People',
        },
        {
          key: 'fullscreen',
          icon: <ExpandOutlined />,
          label: 'Fullscreen',
        },
      ]}
    />
  );

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Space style={{
        background: 'rgba(32, 33, 36, 0.9)',
        padding: '12px 24px',
        borderRadius: 40,
        backdropFilter: 'blur(10px)',
      }}>
        {/* Mic Control */}
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={isAudioOn ? <AudioOutlined /> : <AudioMutedOutlined />}
          onClick={toggleAudio}
          style={{
            background: isAudioOn ? 'transparent' : '#ff4d4f',
            color: isAudioOn ? 'white' : 'white',
            width: 48,
            height: 48,
            fontSize: 20,
          }}
        />

        {/* Video Control */}
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={isVideoOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
          onClick={toggleVideo}
          style={{
            background: isVideoOn ? 'transparent' : '#ff4d4f',
            color: isVideoOn ? 'white' : 'white',
            width: 48,
            height: 48,
            fontSize: 20,
          }}
        />

        {/* Screen Share */}
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<ShareAltOutlined />}
          onClick={toggleScreenShare}
          style={{
            background: isScreenSharing ? '#1890ff' : 'transparent',
            color: 'white',
            width: 48,
            height: 48,
            fontSize: 20,
          }}
        />

        {/* Chat Toggle */}
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={onToggleChat}
          style={{
            color: 'white',
            width: 48,
            height: 48,
            fontSize: 20,
          }}
        />

        {/* Participants Toggle */}
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<TeamOutlined />}
          onClick={onToggleParticipants}
          style={{
            color: 'white',
            width: 48,
            height: 48,
            fontSize: 20,
          }}
        />

        {/* More Options */}
        <Dropdown overlay={moreMenu} placement="topRight">
          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<MoreOutlined />}
            style={{
              color: 'white',
              width: 48,
              height: 48,
              fontSize: 20,
            }}
          />
        </Dropdown>

        {/* Leave Meeting */}
        <Button
          type="primary"
          shape="circle"
          size="large"
          danger
          icon={<PhoneOutlined />}
          onClick={onLeaveMeeting}
          style={{
            background: '#ff4d4f',
            borderColor: '#ff4d4f',
            width: 56,
            height: 56,
            fontSize: 24,
            transform: 'rotate(135deg)',
          }}
        />
      </Space>
    </div>
  );
};

export default ControlsBar;