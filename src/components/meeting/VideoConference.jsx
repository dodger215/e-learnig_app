import { useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useMeeting } from '../../contexts/MeetingContext';

const VideoConference = () => {
  const { localStream, remoteStreams, localVideoRef } = useMeeting();
  const remoteVideoRefs = useRef({});

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    remoteStreams.forEach(streamData => {
      const ref = remoteVideoRefs.current[streamData.id];
      if (ref && streamData.stream) {
        ref.srcObject = streamData.stream;
      }
    });
  }, [remoteStreams]);

  const getGridColumns = () => {
    const totalParticipants = remoteStreams.length + 1;
    if (totalParticipants <= 2) return 1;
    if (totalParticipants <= 4) return 2;
    if (totalParticipants <= 9) return 3;
    return 4;
  };

  const cols = getGridColumns();

  return (
    <div style={{
      background: '#202124',
      height: 'calc(100vh - 200px)',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: 8,
    }}>
      <Row 
        gutter={[8, 8]} 
        style={{ 
          height: '100%',
          padding: 8,
        }}
      >
        {/* Local Video */}
        <Col span={24 / cols}>
          <div style={{
            position: 'relative',
            height: '100%',
            background: '#3c4043',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
            }}>
              You (Local)
            </div>
          </div>
        </Col>

        {/* Remote Videos */}
        {remoteStreams.map((streamData, index) => (
          <Col span={24 / cols} key={streamData.id}>
            <div style={{
              position: 'relative',
              height: '100%',
              background: '#3c4043',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              <video
                ref={el => remoteVideoRefs.current[streamData.id] = el}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12,
              }}>
                Participant {index + 1}
              </div>
            </div>
          </Col>
        ))}

        {/* Placeholder for empty slots */}
        {Array.from({ length: Math.max(0, cols * Math.ceil((remoteStreams.length + 1) / cols) - (remoteStreams.length + 1)) }).map((_, index) => (
          <Col span={24 / cols} key={`empty-${index}`}>
            <div style={{
              height: '100%',
              background: '#3c4043',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
            }}>
              Waiting for participants...
            </div>
          </Col>
        ))}
      </Row>

      {/* Connection Quality Indicator */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#0f9d58',
        }} />
        <span style={{ color: 'white', fontSize: 12 }}>Good connection</span>
      </div>
    </div>
  );
};

export default VideoConference;