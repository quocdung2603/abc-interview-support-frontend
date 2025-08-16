import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RouterLink } from '../../utils/RouterLink';
import UserDropdown from './UserDropdown';

/** Menu có thể có children */
type MenuChild = {
  key: string;
  label: string;
  path: string;
  description?: string;
};
type MenuItem = {
  key: string;
  label: string;
  path?: string;
  children?: MenuChild[];
};

/** Ví dụ: thêm children vào vài mục (tuỳ bạn chỉnh sửa nội dung) */
const menuItems: MenuItem[] = [
  {
    key: '1',
    label: 'Ôn phỏng vấn',
    path: `${RouterLink.InterviewRevision}`,
  },
  {
    key: '2',
    label: 'Phỏng vấn ảo',
    path: `${RouterLink.MockInterview}`,
  },
  {
    key: '3',
    label: 'Tin tức',
    path: `${RouterLink.TrendNews}`,
    children: [
      {
        key: '3-1',
        label: 'Xu hướng',
        path: `${RouterLink.TrendNews}`,
      },
      {
        key: '3-2',
        label: 'Tuyển dụng',
        path: `${RouterLink.RecruitmentNews}`,
      },
    ],
  },
  {
    key: '4',
    label: 'Thảo luận cộng đồng',
    path: `${RouterLink.CommunityDiscussion}`,
  },
  { key: '5', label: 'Giới thiệu', path: `${RouterLink.About}` },
];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Mobile: trạng thái mở accordion submenu
  const [openSubKey, setOpenSubKey] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path?: string) =>
    path ? location.pathname === path : false;
  const hasChildren = (item: MenuItem) =>
    Array.isArray(item.children) && item.children.length > 0;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container-center">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Logo */}
          <button
            onClick={() => navigate(`${RouterLink.Landing}`)}
            className="flex items-center gap-2 select-none hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              ABC
            </span>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
              Interview
            </span>
          </button>

          {/* Desktop menu + sub nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const hasSub = hasChildren(item);

              return (
                <div key={item.key} className="relative group">
                  {/* Nút/Link cấp 1 */}
                  {item.path ? (
                    <Link
                      to={item.path}
                      aria-haspopup={hasSub ? 'menu' : undefined}
                      aria-expanded={hasSub ? undefined : undefined}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                    >
                      {item.label}
                    </button>
                  )}

                  {/* Submenu (desktop): hiện khi hover/focus */}
                  {hasSub && (
                    <div
                      className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 focus-within:visible focus-within:opacity-100 focus-within:translate-y-0
                                 absolute left-0 top-full mt-4 min-w-[220px] rounded-lg border border-neutral-200 bg-white shadow-menu transition-all duration-150"
                      role="menu"
                      aria-label={`${item.label} submenu`}
                    >
                      <ul className="py-2">
                        {item.children!.map((sub) => (
                          <li key={sub.key}>
                            <Link
                              to={sub.path}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-neutral-100 hover:text-blue-700 transition-colors"
                              role="menuitem"
                            >
                              <div className="font-medium">{sub.label}</div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="btn-accent btn-sm">Thi nhanh</button>
            <UserDropdown username="quocdung2603" onLogout={() => {}} />
          </div>
        </div>

        {/* Mobile menu + sub nav dạng accordion */}
        <nav className="flex md:hidden flex-col gap-1 pb-3 px-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const hasSub = hasChildren(item);
            const opened = openSubKey === item.key;

            return (
              <div key={item.key} className="w-full">
                <div className="flex items-center gap-2">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        active
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="flex-1 px-2 py-2 rounded-md text-xs font-medium text-gray-700">
                      {item.label}
                    </span>
                  )}

                  {hasSub && (
                    <button
                      type="button"
                      onClick={() => setOpenSubKey(opened ? null : item.key)}
                      className="px-2 py-2 text-xs text-gray-600 hover:text-blue-600"
                      aria-expanded={opened}
                      aria-controls={`sub-${item.key}`}
                    >
                      {opened ? 'Thu gọn' : 'Mở'}
                    </button>
                  )}
                </div>

                {hasSub && (
                  <div
                    id={`sub-${item.key}`}
                    className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
                      opened ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="pl-3 py-1">
                      {item.children!.map((sub) => (
                        <li key={sub.key}>
                          <Link
                            to={sub.path}
                            className="block px-3 py-2 text-xs rounded-md text-gray-700 hover:bg-neutral-100 hover:text-blue-700"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
