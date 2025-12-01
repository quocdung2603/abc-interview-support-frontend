import React from 'react';
import { Field, Level, Topic } from '@abc-interview-support-frontend/types';


interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedField: string;
  onFieldChange: (fieldId: string) => void;
  selectedTopic: string;
  onTopicChange: (topicId: string) => void;
  selectedLevel: string;
  onLevelChange: (levelId: string) => void;
  selectedPostType: string;
  onPostTypeChange: (postType: string) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedField,
  onFieldChange,
  selectedTopic,
  onTopicChange,
  selectedLevel,
  onLevelChange,
  selectedPostType,
  onPostTypeChange,
  fields,
  topics,
  levels,
}) => {
  const allFields = [
    { id: 'all', name: 'Tất cả lĩnh vực' }, ...fields,];
  const allTopics = [{ id: 'all', name: 'Tất cả chủ đề' }, ...topics];
  const allLevels = [{ id: 'all', name: 'Tất cả cấp độ' }, ...levels];
  const allPostTypes = [
    { id: 'all', name: 'Tất cả loại' },
    { id: 'DISCUSSION', name: 'Thảo luận' },
    { id: 'QUESTION', name: 'Câu hỏi' }
  ];

  return (
    <div className="card-elevated p-3">
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        Bộ lọc cộng đồng
      </h3>

      {/* Compact Horizontal Layout */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search - Compact */}
        <div className="flex-1 lg:flex-none lg:w-80">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, chủ đề..."
              className="input-field pl-10 text-sm py-2"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filters - Compact Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Field Filter */}
          <div>
            <label
              htmlFor="field-select"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Lĩnh vực
            </label>
            <select
              id="field-select"
              className="select-field text-sm py-2"
              value={selectedField}
              onChange={(e) => onFieldChange(e.target.value)}
            >
              {allFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <label
              htmlFor="topic-select"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Chủ đề
            </label>
            <select
              id="topic-select"
              className="select-field text-sm py-2"
              value={selectedTopic}
              onChange={(e) => onTopicChange(e.target.value)}
            >
              {allTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label
              htmlFor="level-select"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Cấp độ
            </label>
            <select
              id="level-select"
              className="select-field text-sm py-2"
              value={selectedLevel}
              onChange={(e) => onLevelChange(e.target.value)}
            >
              {allLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Type Filter */}
          <div>
            <label
              htmlFor="posttype-select"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Loại bài viết
            </label>
            <select
              id="posttype-select"
              className="select-field text-sm py-2"
              value={selectedPostType}
              onChange={(e) => onPostTypeChange(e.target.value)}
            >
              {allPostTypes.map((postType) => (
                <option key={postType.id} value={postType.id}>
                  {postType.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
