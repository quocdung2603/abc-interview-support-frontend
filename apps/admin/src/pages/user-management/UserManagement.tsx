import { User } from '@abc-interview-support-frontend/types';
import {
  UserPageHeader,
  UserTable,
  UserToolbar,
  UserPreviewDrawer,
} from './components/user-m-components';
import { useEffect, useState, useMemo } from 'react';
import confirm from 'antd/es/modal/confirm';
import { userService } from '@abc-interview-support-frontend/services';

const UserManagement = () => {
  const [dataList, setDataList] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rankFilter, setRankFilter] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch =
        item?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.address?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || item?.status === statusFilter;
      const matchesRank = rankFilter === 'all' || item?.eloRank === rankFilter;

      return matchesSearch && matchesStatus && matchesRank;
    });
  }, [dataList, searchText, statusFilter, rankFilter]);

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

  const getAllUsers = async (filterRole: string) => {
    try {
      const res = await userService.getAllUsers();
      let users = res.content || [];

      // Nếu có filter role thì lọc
      if (filterRole) {
        users = users.filter((user: any) => user?.roleName === filterRole);
        console.log('All User:', users);
      }
      setDataList(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setDataList([]);
    }
  };

  useEffect(() => {
    getAllUsers('USER');
  }, [])

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
