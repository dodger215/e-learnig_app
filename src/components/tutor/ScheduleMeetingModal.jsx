import { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, InputNumber, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import meetingApi from '../../api/meetingApi';
import courseApi from '../../api/courseApi';
import { useEffect } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const ScheduleMeetingModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchTutorCourses();
    }
  }, [visible]);

  const fetchTutorCourses = async () => {
    try {
      const allCourses = await courseApi.getCourses();
      const tutorCourses = allCourses.filter(course => course.tutor?._id === user?._id);
      setCourses(tutorCourses);
    } catch (error) {
      message.error('Failed to fetch courses');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const startTime = new Date(values.date.format('YYYY-MM-DD') + 'T' + values.time.format('HH:mm:ss'));

      const meetingData = {
        title: values.title,
        courseId: values.courseId,
        startTime: startTime.toISOString(),
        duration: values.duration,
        description: values.description,
      };

      await meetingApi.scheduleMeeting(meetingData);
      message.success('Meeting scheduled successfully!');
      onSuccess();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(error.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Schedule New Meeting"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Meeting Title"
          rules={[{ required: true, message: 'Please enter meeting title' }]}
        >
          <Input placeholder="Enter meeting title" />
        </Form.Item>

        <Form.Item
          name="courseId"
          label="Select Course"
          rules={[{ required: true, message: 'Please select a course' }]}
        >
          <Select placeholder="Select course" loading={courses.length === 0}>
            {courses.map(course => (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={3} placeholder="Enter meeting description" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select date' }]}
            style={{ flex: 1 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: 'Please select time' }]}
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (min)"
            rules={[{ required: true, message: 'Please enter duration' }]}
            style={{ width: 120 }}
          >
            <InputNumber min={15} max={240} style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ScheduleMeetingModal;