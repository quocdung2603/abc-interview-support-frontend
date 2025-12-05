import React, { useState, useEffect } from 'react';
import {
  CareerPreference,
  Field,
  Topic,
} from '@abc-interview-support-frontend/types';
import { careerService, questionService } from '@abc-interview-support-frontend/services';
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

  const [isLoading, setIsLoading] = useState(true);
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerPreference | null>(
    null
  );
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      setFieldList(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldList([]);
    }
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      setTopicList(res.content || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicList([]);
    }
  };

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
      selectedFieldId ? topicList.filter((t) => t.fieldId === Number(selectedFieldId)) : []
    );
  }, [selectedFieldId, topicList]);

  useEffect(() => {
    getAllFields();
    getAllTopics();
  }, []);

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
    if (!user?.userId || selectedFieldId === undefined) {
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
    setSelectedFieldId(String(career.fieldId));
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
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-1 m-0">
              🎯 Định hướng nghề nghiệp
            </h3>
            <p className="text-sm text-gray-600 m-0">
              Quản lý các lĩnh vực và chủ đề nghề nghiệp bạn quan tâm
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors" onClick={handleOpenCreateModal}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPreferences.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                fields={fieldList}
                topics={topicList}
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
        fields={fieldList}
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
        fields={fieldList}
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
        fields={fieldList}
        topics={topicList}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default CareerTabs;
