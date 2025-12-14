import { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Typography, Empty, Spin, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import courseApi from '../../api/courseApi';
import paymentApi from '../../api/paymentApi';
import CourseCard from '../../components/student/CourseCard';
import PaymentModal from '../../components/student/PaymentModal';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ExploreCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [paymentModal, setPaymentModal] = useState({ visible: false, course: null });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, filter, sortBy]);

  const fetchData = async () => {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        courseApi.getCourses(),
        paymentApi.getEnrollments ? paymentApi.getEnrollments() : paymentApi.checkSubscriptionStatus(),
      ]);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let result = [...courses];

    // Search filter
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filter === 'free') {
      result = result.filter(course => course.isFree);
    } else if (filter === 'paid') {
      result = result.filter(course => !course.isFree);
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  };

  const handleEnroll = (course) => {
    if (course.isFree) {
      paymentApi.enrollFree(course._id)
        .then(() => {
          fetchData();
        })
        .catch(error => {
          console.error('Enrollment failed:', error);
        });
    } else {
      setPaymentModal({ visible: true, course });
    }
  };

  const isCourseEnrolled = (courseId) => {
    return enrollments.some(e => e.course?._id === courseId || e.course === courseId);
  };

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Title level={2}>Explore Courses</Title>

      <div style={{
        background: '#fafafa',
        padding: 24,
        borderRadius: 8,
        marginBottom: 24
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Search
              placeholder="Search courses, tutors, topics..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              value={filter}
              onChange={setFilter}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="all">All Courses</Option>
              <Option value="free">Free Courses</Option>
              <Option value="paid">Paid Courses</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="popular">Most Popular</Option>
              <Option value="newest">Newest First</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {paginatedCourses.map(course => (
              <Col span={8} key={course._id}>
                <CourseCard
                  course={course}
                  isEnrolled={isCourseEnrolled(course._id)}
                  onEnroll={handleEnroll}
                />
              </Col>
            ))}
          </Row>

          {filteredCourses.length === 0 && (
            <Empty
              description="No courses found"
              style={{ margin: '40px 0' }}
            />
          )}

          {filteredCourses.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={currentPage}
                total={filteredCourses.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      <PaymentModal
        visible={paymentModal.visible}
        course={paymentModal.course}
        onClose={() => setPaymentModal({ visible: false, course: null })}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};

export default ExploreCourses;