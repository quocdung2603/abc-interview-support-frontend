import { User } from '@abc-interview-support-frontend/types';
import {
  UserPageHeader,
  UserTable,
  UserToolbar,
  UserPreviewDrawer,
} from './components/user-m-components';
import { useState } from 'react';
import confirm from 'antd/es/modal/confirm';

const UserManagement = () => {
  const mockData: User[] = Array.from({ length: 3 }, (_, i) => {
    const statuses = ['Pending', 'Verified', 'Locked'] as const;
    const ranks = [
      'Newbie',
      'Learner',
      'Contributor',
      'Solver',
      'Expert',
      'Senior Expert',
      'Master',
      'Legend',
    ] as const;
    const streets = [
      'Lê Lợi',
      'Nguyễn Huệ',
      'Trần Hưng Đạo',
      'Hai Bà Trưng',
    ] as const;
    const districts = [
      'Q1, TP.HCM',
      'Ba Đình, Hà Nội',
      'Hải Châu, Đà Nẵng',
      'Ninh Kiều, Cần Thơ',
    ] as const;

    // dateOfBirth random 1985–2003
    const dob = new Date(
      new Date(1985, 0, 1).getTime() +
        Math.random() *
          (new Date(2003, 11, 31).getTime() - new Date(1985, 0, 1).getTime())
    );

    // createdAt random trong 90 ngày gần đây
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    );

    return {
      userId: String(i + 1),
      roleId: String(1 + Math.floor(Math.random() * 3)), // ví dụ 1-3
      email: `user${i + 1}${Math.floor(Math.random() * 900 + 100)}@gmail.com`,
      passWord: Math.random().toString(36).slice(-10), // demo ngẫu nhiên
      fullName: `User ${String(i + 1).padStart(2, '0')}`,
      dateOfBirth: dob,
      address: `Số ${1 + Math.floor(Math.random() * 200)}/${
        1 + Math.floor(Math.random() * 50)
      }, đường ${streets[Math.floor(Math.random() * streets.length)]}, ${
        districts[Math.floor(Math.random() * districts.length)]
      }`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      isStudying: Math.random() < 0.5,
      eloScore: Math.floor(Math.random() * 2001), // 0–2000
      eloRank: ranks[Math.floor(Math.random() * ranks.length)].toString(),
      createdAt,
    } as User;
  });

  const [dataList, setDataList] = useState<User[]>(mockData);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rankFilter, setRankFilter] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.address.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesRank = rankFilter === 'all' || item.eloRank === rankFilter;

    return matchesSearch && matchesStatus && matchesRank;
  });

  const handleLock = (dataId: string) => {
    console.log(dataId);
    confirm({
      title: 'Bạn có chắc muốn khóa tài khoản này?',
      content: 'Bạn có thể mở khóa lại sau khi đã khóa tài khoản',
      okText: 'Xác nhận',
      okType: 'danger',
      maskClosable: true,
      closable: true,
      onOk() {
        //api Lock
      },
      cancelText: 'Hủy',
    });
  };

  const handlePreview = (data: User) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <UserPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <UserToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          rankFilter={rankFilter}
          onRankFilterChange={setRankFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedRowKeys={selectedRowKeys}
        />

        <UserTable
          dataList={filteredData}
          onPreview={handlePreview}
          onLock={handleLock}
        />
      </div>

      <UserPreviewDrawer
        data={selectedItem}
        onClose={() => setPreviewVisible(false)}
        visible={previewVisible}
      />
    </div>
  );
};

export default UserManagement;
