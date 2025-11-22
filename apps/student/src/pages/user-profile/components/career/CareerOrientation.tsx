import React, { useState } from 'react';
import { CareerPreference } from '../../../../../../../libs/types/src/lib/career-types';
import {
  Field,
  Topic,
} from '../../../../../../../libs/types/src/lib/question-types';

interface CareerOrientationProps {
  userCareerPreferences: CareerPreference[];
  availableFields: Field[];
  availableTopics: Topic[];
  onUpdateCareerPreferences: (preferences: CareerPreference[]) => void;
}

const CareerOrientation: React.FC<CareerOrientationProps> = ({
  userCareerPreferences,
  availableFields,
  availableTopics,
  onUpdateCareerPreferences,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<
    {
      fieldId: string;
      topicIds: string[];
    }[]
  >(
    userCareerPreferences.reduce((acc, pref) => {
      const existingField = acc.find((item) => item.fieldId === String(pref.fieldId));
      if (existingField && pref.topicId) {
        existingField.topicIds.push(String(pref.topicId));
      } else if (!existingField) {
        acc.push({
          fieldId: String(pref.fieldId),
          topicIds: pref.topicId ? [String(pref.topicId)] : [],
        });
      }
      return acc;
    }, [] as { fieldId: string; topicIds: string[] }[])
  );

  const [careerGoals, setCareerGoals] = useState({
    shortTerm: 'Tìm được công việc phù hợp với chuyên môn',
    longTerm: 'Phát triển thành chuyên gia trong lĩnh vực',
    targetSalary: '',
    preferredCompanySize: 'medium' as
      | 'startup'
      | 'small'
      | 'medium'
      | 'large'
      | 'enterprise',
    workLocation: 'hybrid' as 'remote' | 'onsite' | 'hybrid',
  });

  const handleFieldToggle = (fieldId: string) => {
    setSelectedPreferences((prev) => {
      const exists = prev.find((item) => item.fieldId === fieldId);
      if (exists) {
        return prev.filter((item) => item.fieldId !== fieldId);
      } else {
        return [...prev, { fieldId, topicIds: [] }];
      }
    });
  };

  const updateTopicIds = (currentIds: string[], topicId: string) => {
    return currentIds.includes(topicId)
      ? currentIds.filter((id) => id !== topicId)
      : [...currentIds, topicId];
  };

  const handleTopicToggle = (fieldId: string, topicId: string) => {
    setSelectedPreferences((prev) => {
      return prev.map((item) => {
        if (item.fieldId === fieldId) {
          return {
            ...item,
            topicIds: updateTopicIds(item.topicIds, topicId),
          };
        }
        return item;
      });
    });
  };

  const handleSave = () => {
    const newPreferences: CareerPreference[] = [];

    selectedPreferences.forEach((fieldPref) => {
      if (fieldPref.topicIds.length === 0) {
        newPreferences.push({
          id: Date.now() + Math.random(),
          userId: Number(userCareerPreferences[0]?.userId) || 0,
          fieldId: Number(fieldPref.fieldId),
          createdAt: new Date().toISOString(),
        });
      } else {
        fieldPref.topicIds.forEach((topicId, index) => {
          newPreferences.push({
            id: Date.now() + Math.random() + index,
            userId: Number(userCareerPreferences[0]?.userId) || 0,
            fieldId: Number(fieldPref.fieldId),
            topicId: Number(topicId),
            createdAt: new Date().toISOString(),
          });
        });
      }
    });

    onUpdateCareerPreferences(newPreferences);
    setIsEditing(false);
  };

  const getTopicName = (topicId: string) => {
    return (
      availableTopics.find((topic) => String(topic.id) === topicId)?.name ||
      topicId
    );
  };

  const getTopicsForField = (fieldId: string) => {
    return availableTopics.filter((topic) => topic.fieldId === Number(fieldId));
  };

  const getCompanySizeText = (size: string) => {
    switch (size) {
      case 'startup':
        return 'Startup (1-10 nhân viên)';
      case 'small':
        return 'Công ty nhỏ (11-50 nhân viên)';
      case 'medium':
        return 'Công ty vừa (51-200 nhân viên)';
      case 'large':
        return 'Công ty lớn (201-1000 nhân viên)';
      case 'enterprise':
        return 'Tập đoàn (1000+ nhân viên)';
      default:
        return size;
    }
  };

  const getWorkLocationText = (location: string) => {
    switch (location) {
      case 'remote':
        return 'Làm việc từ xa';
      case 'onsite':
        return 'Làm việc tại văn phòng';
      case 'hybrid':
        return 'Làm việc linh hoạt';
      default:
        return location;
    }
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <h2
          className="text-heading-1"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Định hướng nghề nghiệp
        </h2>
        {!isEditing ? (
          <button
            className="btn-accent btn-sm"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <button className="btn-primary btn-sm" onClick={handleSave}>
              Lưu
            </button>
            <button
              className="btn-outline btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {/* Career Fields & Topics */}
        <div>
          <h3
            className="text-heading-2"
            style={{
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-neutral-800)',
            }}
          >
            Lĩnh vực quan tâm
          </h3>

          {isEditing ? (
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              {availableFields.map((field) => {
                const fieldSelected = selectedPreferences.some(
                  (pref) => pref.fieldId === String(field.id)
                );
                const fieldTopics = getTopicsForField(String(field.id));
                const selectedTopics =
                  selectedPreferences.find(
                    (pref) => pref.fieldId === String(field.id)
                  )?.topicIds || [];

                return (
                  <div
                    key={field.id}
                    className="card-interactive"
                    style={{ padding: 'var(--spacing-md)' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-sm)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={fieldSelected}
                        onChange={() => handleFieldToggle(String(field.id))}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'var(--color-neutral-800)',
                          }}
                        >
                          {field.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-neutral-600)',
                          }}
                        >
                          {field.description}
                        </div>
                      </div>
                    </div>

                    {fieldSelected && fieldTopics.length > 0 && (
                      <div
                        style={{
                          marginLeft: '2rem',
                          paddingTop: 'var(--spacing-sm)',
                          borderTop: '1px solid var(--color-neutral-200)',
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 'var(--spacing-xs)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--color-neutral-700)',
                          }}
                        >
                          Chọn chủ đề cụ thể:
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 'var(--spacing-xs)',
                          }}
                        >
                          {fieldTopics.map((topic) => (
                            <label
                              key={topic.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedTopics.includes(String(topic.id))}
                                onChange={() =>
                                  handleTopicToggle(
                                    String(field.id),
                                    String(topic.id)
                                  )
                                }
                              />
                              <span
                                style={{
                                  fontSize: '0.875rem',
                                  color: 'var(--color-neutral-700)',
                                }}
                              >
                                {topic.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {userCareerPreferences.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-xl)',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
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
                    Chưa có định hướng nghề nghiệp nào được thiết lập
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                  {availableFields
                    .filter((field) =>
                      userCareerPreferences.some(
                        (pref) => pref.fieldId === field.id
                      )
                    )
                    .map((field) => {
                      const fieldPreferences = userCareerPreferences.filter(
                        (pref) => pref.fieldId === field.id
                      );
                      const hasTopicPreferences = fieldPreferences.some(
                        (pref) => pref.topicId
                      );

                      return (
                        <div
                          key={field.id}
                          className="card-interactive"
                          style={{ padding: 'var(--spacing-md)' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-sm)',
                              marginBottom: 'var(--spacing-sm)',
                            }}
                          >
                            <span className="badge-accent">
                              {field.name}
                            </span>
                          </div>
                          {hasTopicPreferences && (
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-xs)',
                              }}
                            >
                              {fieldPreferences
                                .filter((pref) => pref.topicId)
                                .map((pref) => (
                                  <span
                                    key={pref.id}
                                    className="badge-secondary"
                                  >
                                    {pref.topicId && getTopicName(String(pref.topicId))}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Career Goals */}
        <div>
          <h3
            className="text-heading-2"
            style={{
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-neutral-800)',
            }}
          >
            Mục tiêu nghề nghiệp
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Mục tiêu ngắn hạn (6 tháng - 1 năm)
              </div>
              {isEditing ? (
                <textarea
                  className="input-field"
                  value={careerGoals.shortTerm}
                  onChange={(e) =>
                    setCareerGoals({
                      ...careerGoals,
                      shortTerm: e.target.value,
                    })
                  }
                  placeholder="Nhập mục tiêu ngắn hạn"
                  rows={3}
                />
              ) : (
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {careerGoals.shortTerm}
                </p>
              )}
            </div>

            <div>
              <div
                style={{
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Mục tiêu dài hạn (2-5 năm)
              </div>
              {isEditing ? (
                <textarea
                  className="input-field"
                  value={careerGoals.longTerm}
                  onChange={(e) =>
                    setCareerGoals({ ...careerGoals, longTerm: e.target.value })
                  }
                  placeholder="Nhập mục tiêu dài hạn"
                  rows={3}
                />
              ) : (
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {careerGoals.longTerm}
                </p>
              )}
            </div>

            <div>
              <div
                style={{
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Mức lương mong muốn
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="input-field"
                  value={careerGoals.targetSalary}
                  onChange={(e) =>
                    setCareerGoals({
                      ...careerGoals,
                      targetSalary: e.target.value,
                    })
                  }
                  placeholder="VD: 15-20 triệu VND"
                />
              ) : (
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem 0',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {careerGoals.targetSalary || 'Chưa xác định'}
                </p>
              )}
            </div>

            <div>
              <div
                style={{
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Quy mô công ty mong muốn
              </div>
              {isEditing ? (
                <select
                  className="select-field"
                  value={careerGoals.preferredCompanySize}
                  onChange={(e) =>
                    setCareerGoals({
                      ...careerGoals,
                      preferredCompanySize: e.target.value as any,
                    })
                  }
                >
                  <option value="startup">Startup (1-10 nhân viên)</option>
                  <option value="small">Công ty nhỏ (11-50 nhân viên)</option>
                  <option value="medium">Công ty vừa (51-200 nhân viên)</option>
                  <option value="large">
                    Công ty lớn (201-1000 nhân viên)
                  </option>
                  <option value="enterprise">Tập đoàn (1000+ nhân viên)</option>
                </select>
              ) : (
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem 0',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {getCompanySizeText(careerGoals.preferredCompanySize)}
                </p>
              )}
            </div>

            <div>
              <div
                style={{
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Hình thức làm việc
              </div>
              {isEditing ? (
                <select
                  className="select-field"
                  value={careerGoals.workLocation}
                  onChange={(e) =>
                    setCareerGoals({
                      ...careerGoals,
                      workLocation: e.target.value as any,
                    })
                  }
                >
                  <option value="remote">Làm việc từ xa</option>
                  <option value="onsite">Làm việc tại văn phòng</option>
                  <option value="hybrid">Làm việc linh hoạt</option>
                </select>
              ) : (
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem 0',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {getWorkLocationText(careerGoals.workLocation)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerOrientation;
