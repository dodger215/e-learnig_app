import React, { useState } from 'react';
import { Modal, Steps, Button, Typography, Card, Input, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import paymentApi from '../../api/paymentApi';

const { Step } = Steps;
const { Title, Text } = Typography;

const PaymentModal = ({ visible, course, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: 'Initialize Payment',
      content: 'Initializing payment gateway...',
    },
    {
      title: 'Make Payment',
      content: 'Redirecting to payment page...',
    },
    {
      title: 'Complete Enrollment',
      content: 'Verifying payment and enrolling...',
    },
  ];

  // Reset state when modal closes
  React.useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setPaymentUrl('');
      setReference('');
      setLoading(false);
    }
  }, [visible]);

  const handleInitializePayment = async () => {
    if (!course || !course._id) {
      message.error('Invalid course selected');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentApi.initializePayment(course._id);
      setPaymentUrl(response.authorization_url);
      setReference(response.reference);
      setCurrentStep(1);

      // Open payment in new window
      window.open(response.authorization_url, '_blank', 'width=600,height=700');
    } catch (error) {
      message.error(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!reference) {
      message.error('No payment reference found');
      return;
    }

    setLoading(true);
    try {
      await paymentApi.verifyPayment(reference);
      setCurrentStep(2);
      message.success('Payment verified successfully!');

      // Wait a moment before closing
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      message.error(error.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Title level={4}>Course: {course?.title || 'Loading...'}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              {course ? 'You are about to enroll in this course' : 'Please select a course'}
            </Text>

            {course ? (
              <Card style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text>Course Price:</Text>
                  <Text strong>${course.price || 0}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text>Platform Fee:</Text>
                  <Text strong>$0.00</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                  <Text strong>Total Amount:</Text>
                  <Title level={4} style={{ margin: 0 }}>${course.price || 0}</Title>
                </div>
              </Card>
            ) : (
              <div style={{ padding: 40 }}>
                <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  Loading course details...
                </Text>
              </div>
            )}

            <Button
              type="primary"
              size="large"
              onClick={handleInitializePayment}
              loading={loading}
              disabled={!course}
              style={{ marginTop: 24 }}
            >
              Proceed to Payment
            </Button>
          </div>
        );

      case 1:
        return (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Title level={4}>Payment Window Opened</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              Please complete the payment in the opened window. Then click "Verify Payment" below.
            </Text>

            {reference && (
              <div style={{ marginBottom: 16 }}>
                <Text>Reference: </Text>
                <Text copyable code>{reference}</Text>
              </div>
            )}

            <div>
              <Button
                type="primary"
                onClick={handleVerifyPayment}
                loading={loading}
                style={{ marginRight: 8 }}
              >
                Verify Payment
              </Button>
              {paymentUrl && (
                <Button onClick={() => window.open(paymentUrl, '_blank')}>
                  Open Payment Again
                </Button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={3}>Enrollment Successful!</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              You have been successfully enrolled in the course.
            </Text>
            <Text>You can now access all course materials and join scheduled meetings.</Text>
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Text>An error occurred. Please try again.</Text>
          </div>
        );
    }
  };

  return (
    <Modal
      title="Course Enrollment"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      closable={currentStep === 0}
      maskClosable={currentStep === 0}
    >
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

      {renderStepContent()}
    </Modal>
  );
};

export default PaymentModal;