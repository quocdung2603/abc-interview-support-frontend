import React from 'react';
import { UserOutlined, FileTextOutlined, TeamOutlined, CompassOutlined } from '@ant-design/icons';

interface SidebarProps {
  activeSection: string;
  activeSubsection?: string;
  onSectionChange: (section: string, subsection?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  activeSubsection,
  onSectionChange,
}) => {
  const menuItems = [
    {
      id: 'personal',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      subItems: [
        { id: 'info', label: 'Thông tin cá nhân' },
        { id: 'elo', label: 'Elo & xếp hạng' },
        { id: 'recruiter', label: 'Đăng ký nhà tuyển dụng' },
      ],
    },
    {
      id: 'exams',
      label: 'Bài kiểm tra',
      icon: <FileTextOutlined />,
    },
    {
      id: 'community',
      label: 'Cộng đồng',
      icon: <TeamOutlined />,
      subItems: [
        { id: 'discussions', label: 'Thảo luận' },
        { id: 'questions', label: 'Câu hỏi' },
        { id: 'news', label: 'Tin tức' },
      ]
    },
    {
      id: 'career',
      label: 'Định hướng nghề nghiệp',
      icon: <CompassOutlined />,
    },
  ];

  return (
    <div className="w-72 min-h-screen bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3 text-sm">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>

                  {activeSection === item.id && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onSectionChange(item.id, subItem.id)}
                          className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors text-xs ${activeSubsection === subItem.id
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-3 text-sm">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;