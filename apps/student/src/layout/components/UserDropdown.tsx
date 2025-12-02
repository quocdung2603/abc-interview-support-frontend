import { useState, useRef, useEffect } from 'react';
import { Menu, MenuProps } from 'antd';
import { LogoutOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouterLink } from '../../utils/RouterLink';

interface UserDropdownProps {
  username: string | undefined;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: <span className="font-medium text-gray-700">Trang cá nhân</span>,
      icon: <EyeOutlined className="text-blue-600" />,
      onClick: () => {
        navigate(`${RouterLink.UserProfile}`);
        setIsOpen(false);
      },
    },
    {
      key: '2',
      label: <span className="font-medium text-red-600">Đăng xuất</span>,
      icon: <LogoutOutlined className="text-red-500" />,
      onClick: () => {
        onLogout();
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <img
          src="https://picsum.photos/200/300?random=1"
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
        />
        <span className="text-gray-700 font-medium text-sm truncate max-w-[120px] hidden sm:block">
          {username}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in-up overflow-hidden">
          <Menu
            className="bg-white [&_.ant-menu-item]:!px-4 [&_.ant-menu-item]:!py-3 [&_.ant-menu-item]:!rounded-none [&_.ant-menu-item-selected]:!bg-blue-50 [&_.ant-menu-item]:hover:!bg-gray-50 [&_.ant-menu-item]:!text-sm"
            items={menuItems}
          />
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
