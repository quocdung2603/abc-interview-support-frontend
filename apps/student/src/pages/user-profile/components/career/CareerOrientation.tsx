import React, { useState } from 'react';
import { CareerPreference } from '@abc-interview-support-frontend/types';
import {
  Field,
  Topic,
} from '@abc-interview-support-frontend/types';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600 m-0">
          Định hướng nghề nghiệp
        </h2>
        {!isEditing ? (
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
              Lưu
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              Hủy
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Career Fields & Topics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Lĩnh vực quan tâm
          </h3>

          {isEditing ? (
            <div className="space-y-4">
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
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={fieldSelected}
                        onChange={() => handleFieldToggle(String(field.id))}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {field.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {field.description}
                        </div>
                      </div>
                    </div>

                    {fieldSelected && fieldTopics.length > 0 && (
                      <div className="ml-8 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Chọn chủ đề cụ thể:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {fieldTopics.map((topic) => (
                            <label
                              key={topic.id}
                              className="flex items-center gap-2 cursor-pointer"
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
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
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
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4 opacity-30">🎯</div>
                  <p className="text-gray-500 m-0">
                    Chưa có định hướng nghề nghiệp nào được thiết lập
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
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
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                              {field.name}
                            </span>
                          </div>
                          {hasTopicPreferences && (
                            <div className="flex flex-wrap gap-2">
                              {fieldPreferences
                                .filter((pref) => pref.topicId)
                                .map((pref) => (
                                  <span
                                    key={pref.id}
                                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Mục tiêu nghề nghiệp
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Mục tiêu ngắn hạn (6 tháng - 1 năm)
              </div>
              {isEditing ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
                <p className="m-0 p-3 bg-gray-50 rounded-md text-gray-900 text-sm">
                  {careerGoals.shortTerm}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Mục tiêu dài hạn (2-5 năm)
              </div>
              {isEditing ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  value={careerGoals.longTerm}
                  onChange={(e) =>
                    setCareerGoals({ ...careerGoals, longTerm: e.target.value })
                  }
                  placeholder="Nhập mục tiêu dài hạn"
                  rows={3}
                />
              ) : (
                <p className="m-0 p-3 bg-gray-50 rounded-md text-gray-900 text-sm">
                  {careerGoals.longTerm}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Mức lương mong muốn
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <p className="m-0 py-3 text-gray-900 text-sm">
                  {careerGoals.targetSalary || 'Chưa xác định'}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Quy mô công ty mong muốn
              </div>
              {isEditing ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <p className="m-0 py-3 text-gray-900 text-sm">
                  {getCompanySizeText(careerGoals.preferredCompanySize)}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Hình thức làm việc
              </div>
              {isEditing ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <p className="m-0 py-3 text-gray-900 text-sm">
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
