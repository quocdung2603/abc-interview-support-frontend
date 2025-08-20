import React, { useState } from 'react';
import TabNavigation from '../TabNavigation';

interface CareerGuideItem {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
  progress: number;
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  field: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    resources: string[];
    isCompleted: boolean;
  }>;
  totalProgress: number;
  isPersonalized: boolean;
  createdDate: Date;
}

interface CareerTabsProps {
  careerGuides: CareerGuideItem[];
  roadmaps: RoadmapItem[];
  onCompleteGuide: (guideId: string) => void;
  onCompleteStep: (roadmapId: string, stepId: string) => void;
  onCreateRoadmap: (field: string, preferences: any) => void;
  onDeleteRoadmap: (roadmapId: string) => void;
}

const CareerTabs: React.FC<CareerTabsProps> = ({
  careerGuides,
  roadmaps,
  onCompleteGuide,
  onCompleteStep,
  onCreateRoadmap,
  onDeleteRoadmap,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('career-guide');
  const [showCreateRoadmap, setShowCreateRoadmap] = useState(false);
  const [selectedField, setSelectedField] = useState('');

  const subTabs = [
    {
      id: 'career-guide',
      label: 'Định hướng nghề nghiệp',
      icon: '',
      description: 'Hướng dẫn phát triển sự nghiệp',
      badge:
        careerGuides.filter((guide) => !guide.isCompleted).length || undefined,
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: '',
      description: 'Lộ trình học tập cá nhân',
      badge: roadmaps.length || undefined,
    },
  ];

  const careerFields = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Quality Assurance',
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'var(--color-success)';
      case 'Intermediate':
        return 'var(--color-warning)';
      case 'Advanced':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-600)';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'Cơ bản';
      case 'Intermediate':
        return 'Trung cấp';
      case 'Advanced':
        return 'Nâng cao';
      default:
        return difficulty;
    }
  };

  const handleCreateRoadmap = () => {
    if (selectedField) {
      onCreateRoadmap(selectedField, {
        customized: true,
        includeProjects: true,
        includeCertifications: true,
      });
      setShowCreateRoadmap(false);
      setSelectedField('');
    }
  };

  const renderCareerGuide = () => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-3"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Định hướng nghề nghiệp
        </h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button className="btn-outline btn-sm">🔥 Phổ biến</button>
          <button className="btn-outline btn-sm">✅ Đã hoàn thành</button>
          <button className="btn-outline btn-sm">📊 Theo tiến độ</button>
        </div>
      </div>

      {careerGuides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            🎯
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có hướng dẫn nghề nghiệp
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          {careerGuides.map((guide) => (
            <div
              key={guide.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <span
                    className="badge-neutral"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {guide.category}
                  </span>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getDifficultyColor(guide.difficulty),
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    {getDifficultyText(guide.difficulty)}
                  </span>
                </div>
                <h4
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {guide.title}
                </h4>
                <p
                  style={{
                    margin: '0 0 1rem 0',
                    color: 'var(--color-neutral-600)',
                    lineHeight: 1.5,
                    fontSize: '0.875rem',
                  }}
                >
                  {guide.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-600)',
                    }}
                  >
                    Tiến độ
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {guide.progress}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--color-neutral-200)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${guide.progress}%`,
                      height: '100%',
                      backgroundColor: guide.isCompleted
                        ? 'var(--color-success)'
                        : 'var(--color-accent)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-neutral-500)',
                  }}
                >
                  ⏱️ {guide.readTime} phút
                </span>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                  {guide.isCompleted ? (
                    <span
                      className="badge-success"
                      style={{ fontSize: '0.75rem' }}
                    >
                      ✓ Hoàn thành
                    </span>
                  ) : (
                    <button
                      className="btn-accent btn-sm"
                      onClick={() => onCompleteGuide(guide.id)}
                    >
                      📖 Học ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRoadmap = () => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-3"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Lộ trình học tập
        </h3>
        <button
          className="btn-accent"
          onClick={() => setShowCreateRoadmap(true)}
        >
          ➕ Tạo roadmap mới
        </button>
      </div>

      {/* Create Roadmap Modal */}
      {showCreateRoadmap && (
        <div
          className="card-elevated"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            padding: 'var(--spacing-lg)',
            width: '90%',
            maxWidth: '500px',
            backgroundColor: 'white',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h4
            style={{
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-neutral-800)',
            }}
          >
            Tạo roadmap mới
          </h4>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
              htmlFor="career-field-select"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Chọn lĩnh vực:
            </label>
            <select
              id="career-field-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '1px solid var(--color-neutral-300)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              }}
            >
              <option value="">-- Chọn lĩnh vực --</option>
              {careerFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className="btn-outline"
              onClick={() => {
                setShowCreateRoadmap(false);
                setSelectedField('');
              }}
            >
              Hủy
            </button>
            <button
              className="btn-accent"
              onClick={handleCreateRoadmap}
              disabled={!selectedField}
            >
              Tạo roadmap
            </button>
          </div>
        </div>
      )}
      {showCreateRoadmap && (
        <button
          type="button"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 999,
          }}
          onClick={() => setShowCreateRoadmap(false)}
          aria-label="Close modal"
        />
      )}

      {roadmaps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            🛣️
          </div>
          <p
            style={{
              color: 'var(--color-neutral-500)',
              margin: '0 0 var(--spacing-md) 0',
            }}
          >
            Chưa có lộ trình học tập nào
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-neutral-400)',
              margin: 0,
            }}
          >
            Tạo lộ trình học tập cá nhân để theo dõi tiến độ của bạn
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)',
          }}
        >
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-lg)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    <span
                      className="badge-accent"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {roadmap.field}
                    </span>
                    {roadmap.isPersonalized && (
                      <span
                        className="badge-success"
                        style={{ fontSize: '0.75rem' }}
                      >
                        🎯 Cá nhân hóa
                      </span>
                    )}
                  </div>
                  <h4
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {roadmap.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 1rem 0',
                      color: 'var(--color-neutral-600)',
                      lineHeight: 1.5,
                    }}
                  >
                    {roadmap.description}
                  </p>

                  {/* Overall Progress */}
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-neutral-600)',
                        }}
                      >
                        Tiến độ tổng thể
                      </span>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--color-accent)',
                        }}
                      >
                        {roadmap.totalProgress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'var(--color-neutral-200)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${roadmap.totalProgress}%`,
                          height: '100%',
                          backgroundColor: 'var(--color-accent)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    📅 Tạo ngày:{' '}
                    {new Date(roadmap.createdDate).toLocaleDateString('vi-VN')}{' '}
                    • {roadmap.steps.length} bước •{' '}
                    {roadmap.steps.filter((step) => step.isCompleted).length}{' '}
                    hoàn thành
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn-outline btn-sm">
                    👁️ Xem chi tiết
                  </button>
                  <button
                    className="btn-outline btn-sm"
                    onClick={() => onDeleteRoadmap(roadmap.id)}
                    style={{
                      color: 'var(--color-danger)',
                      borderColor: 'var(--color-danger)',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Roadmap Steps Preview */}
              <div>
                <h5
                  style={{
                    margin: '0 0 var(--spacing-sm) 0',
                    fontSize: '1rem',
                    color: 'var(--color-neutral-700)',
                  }}
                >
                  Các bước trong lộ trình:
                </h5>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  {roadmap.steps.slice(0, 3).map((step) => (
                    <div
                      key={step.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: step.isCompleted
                          ? 'var(--color-success-10)'
                          : 'var(--color-neutral-50)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={step.isCompleted}
                        onChange={() => onCompleteStep(roadmap.id, step.id)}
                        style={{ accentColor: 'var(--color-success)' }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: '0.875rem',
                          color: step.isCompleted
                            ? 'var(--color-success-dark)'
                            : 'var(--color-neutral-700)',
                          textDecoration: step.isCompleted
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {step.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-neutral-500)',
                        }}
                      >
                        ⏱️ {step.estimatedTime}
                      </span>
                    </div>
                  ))}
                  {roadmap.steps.length > 3 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-sm)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-neutral-500)',
                        }}
                      >
                        ... và {roadmap.steps.length - 3} bước khác
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'career-guide':
        return renderCareerGuide();
      case 'roadmap':
        return renderRoadmap();
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      <div style={{ minHeight: '400px' }}>{renderSubTabContent()}</div>
    </div>
  );
};

export default CareerTabs;
