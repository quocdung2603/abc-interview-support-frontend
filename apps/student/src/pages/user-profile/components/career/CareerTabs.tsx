import React, { useState, useEffect } from 'react';
import {
  CareerPreference,
  Field,
  Topic,
} from '@abc-interview-support-frontend/types';
import { CareerService } from '@abc-interview-support-frontend/services';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import CareerCard from './CareerCard';
import CreateCareerModal from './CreateCareerModal';
import EditCareerModal from './EditCareerModal';
import DetailCareerModal from './DetailCareerModal';

const CareerTabs: React.FC = () => {
  const { user } = useAuth();
  const [careerPreferences, setCareerPreferences] = useState<
    CareerPreference[]
  >([]);
  const [fields] = useState<Field[]>([
    {
      fieldId: '1',
      fieldName: 'Frontend Development',
      description:
        'Phát triển giao diện người dùng với HTML, CSS, JavaScript và các framework như React, Vue.js, Angular. Tập trung vào trải nghiệm người dùng (UX/UI).',
    },
    {
      fieldId: '2',
      fieldName: 'Backend Development',
      description:
        'Phát triển hệ thống backend, xử lý logic nghiệp vụ, database, API với các công nghệ như Node.js, Spring Boot, Django, .NET.',
    },
    {
      fieldId: '3',
      fieldName: 'Full Stack Development',
      description:
        'Kết hợp cả frontend và backend development. Có khả năng xây dựng ứng dụng web hoàn chỉnh từ giao diện đến server.',
    },
    {
      fieldId: '4',
      fieldName: 'Mobile Development',
      description:
        'Phát triển ứng dụng di động cho iOS, Android với React Native, Flutter, Swift, Kotlin. Tối ưu cho trải nghiệm mobile.',
    },
    {
      fieldId: '5',
      fieldName: 'DevOps',
      description:
        'Vận hành và triển khai ứng dụng. Quản lý CI/CD, container (Docker), orchestration (Kubernetes), cloud infrastructure (AWS, Azure, GCP).',
    },
  ]);
  const [topics] = useState<Topic[]>([
    { topicId: '1', fieldId: '1', topicName: 'React' },
    { topicId: '2', fieldId: '1', topicName: 'Vue.js' },
    { topicId: '3', fieldId: '2', topicName: 'Node.js' },
    { topicId: '4', fieldId: '2', topicName: 'Spring Boot' },
    { topicId: '5', fieldId: '4', topicName: 'React Native' },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerPreference | null>(
    null
  );
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  const careerService = new CareerService();

  // Helper function to handle different API response structures
  const parseCareerResponse = (response: any): CareerPreference[] => {
    if (Array.isArray(response)) {
      return response;
    } else if (response?.content && Array.isArray(response.content)) {
      return response.content;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response) {
      // Single object response - wrap in array
      return [response];
    }
    return [];
  };

  const fetchCareerPreferences = async () => {
    if (!user?.userId) return;
    try {
      const response = await careerService.getCareerByUserId(
        Number(user.userId),
        0,
        100,
        'createdAt,desc'
      );
      setCareerPreferences(parseCareerResponse(response));
    } catch (err) {
      console.error('Failed to fetch career preferences:', err);
      setCareerPreferences([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCareerPreferences();
      setIsLoading(false);
    };
    fetchData();
  }, [user?.userId]);

  useEffect(() => {
    setFilteredTopics(
      selectedFieldId ? topics.filter((t) => t.fieldId === selectedFieldId) : []
    );
  }, [selectedFieldId, topics]);

  const resetForm = () => {
    setSelectedFieldId('');
    setSelectedTopicId('');
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleCreateCareer = async () => {
    if (!user?.userId || !selectedFieldId) {
      alert('⚠️ Vui lòng chọn lĩnh vực');
      return;
    }

    try {
      await careerService.createCareerPreference(
        Number(user.userId),
        Number(selectedFieldId),
        selectedTopicId ? Number(selectedTopicId) : undefined
      );

      // Refresh data
      await fetchCareerPreferences();

      handleCloseCreateModal();
      alert('✅ Tạo định hướng nghề nghiệp thành công!');
    } catch (err) {
      console.error('Failed to create career preference:', err);
      alert('❌ Không thể tạo định hướng nghề nghiệp. Vui lòng thử lại.');
    }
  };

  const handleOpenEditModal = (career: CareerPreference) => {
    setSelectedCareer(career);
    // Convert to string since backend returns number but form expects string
    setSelectedFieldId(career.fieldId ? String(career.fieldId) : '');
    setSelectedTopicId(career.topicId ? String(career.topicId) : '');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCareer(null);
    resetForm();
  };

  const handleUpdateCareer = async () => {
    if (!selectedCareer?.id || !user?.userId || !selectedFieldId) {
      alert('⚠️ Thiếu thông tin cần thiết');
      return;
    }

    try {
      await careerService.updateCareerPreference(
        String(selectedCareer.id), // Convert number to string for API
        Number(user.userId),
        Number(selectedFieldId),
        selectedTopicId ? Number(selectedTopicId) : undefined
      );

      // Refresh data
      await fetchCareerPreferences();

      handleCloseEditModal();
      alert('✅ Cập nhật định hướng nghề nghiệp thành công!');
    } catch (err) {
      console.error('Failed to update career preference:', err);
      alert('❌ Không thể cập nhật định hướng nghề nghiệp. Vui lòng thử lại.');
    }
  };

  const handleOpenDetailModal = (career: CareerPreference) => {
    setSelectedCareer(career);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCareer(null);
  };

  const handleDeleteCareer = async (careerId: number) => {
    const confirmed = window.confirm(
      '⚠️ Bạn có chắc chắn muốn xóa định hướng nghề nghiệp này?'
    );
    if (!confirmed) return;

    try {
      // Note: Delete API endpoint needs to be added to careerService when backend is ready
      // For now, just remove from local state (client-side only)
      setCareerPreferences((prev) => prev.filter((c) => c.id !== careerId));

      alert('✅ Xóa định hướng nghề nghiệp thành công!');
    } catch (err) {
      console.error('Failed to delete career preference:', err);
      alert('❌ Không thể xóa định hướng nghề nghiệp. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: 'var(--color-neutral-600)' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)',
          }}
        >
          <div>
            <h3
              style={{
                margin: '0 0 0.25rem 0',
                color: 'var(--color-neutral-800)',
                fontSize: '1.5rem',
              }}
            >
              🎯 Định hướng nghề nghiệp
            </h3>
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-600)',
                fontSize: '0.875rem',
              }}
            >
              Quản lý các lĩnh vực và chủ đề nghề nghiệp bạn quan tâm
            </p>
          </div>
          <button className="btn-accent" onClick={handleOpenCreateModal}>
            ➕ Thêm định hướng mới
          </button>
        </div>

        {/* Empty State */}
        {careerPreferences.length === 0 && (
          <div
            className="card-soft"
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
            }}
          >
            <div
              style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}
            >
              📋
            </div>
            <h4
              style={{
                margin: '0 0 var(--spacing-sm) 0',
                color: 'var(--color-neutral-700)',
              }}
            >
              Chưa có định hướng nghề nghiệp
            </h4>
            <p
              style={{
                margin: '0 0 var(--spacing-md) 0',
                color: 'var(--color-neutral-600)',
                fontSize: '0.875rem',
              }}
            >
              Hãy thêm lĩnh vực và chủ đề bạn quan tâm để xây dựng lộ trình nghề
              nghiệp của mình
            </p>
            <button className="btn-accent" onClick={handleOpenCreateModal}>
              ➕ Thêm định hướng đầu tiên
            </button>
          </div>
        )}

        {/* Career Grid */}
        {careerPreferences.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            {careerPreferences.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                fields={fields}
                topics={topics}
                onViewDetail={handleOpenDetailModal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteCareer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCareerModal
        isOpen={showCreateModal}
        fields={fields}
        selectedFieldId={selectedFieldId}
        selectedTopicId={selectedTopicId}
        filteredTopics={filteredTopics}
        onClose={handleCloseCreateModal}
        onFieldChange={setSelectedFieldId}
        onTopicChange={setSelectedTopicId}
        onCreate={handleCreateCareer}
      />

      <EditCareerModal
        isOpen={showEditModal}
        career={selectedCareer}
        fields={fields}
        selectedFieldId={selectedFieldId}
        selectedTopicId={selectedTopicId}
        filteredTopics={filteredTopics}
        onClose={handleCloseEditModal}
        onFieldChange={setSelectedFieldId}
        onTopicChange={setSelectedTopicId}
        onUpdate={handleUpdateCareer}
      />

      <DetailCareerModal
        isOpen={showDetailModal}
        career={selectedCareer}
        fields={fields}
        topics={topics}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default CareerTabs;
