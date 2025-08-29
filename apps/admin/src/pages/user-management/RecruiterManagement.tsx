import {
  User,
  RecruiterVerification,
  CompanyDocument,
} from '@abc-interview-support-frontend/types';
import { useState } from 'react';
import confirm from 'antd/es/modal/confirm';
import {
  RecruiterPageHeader,
  RecruiterPreviewDrawer,
  RecruiterTable,
  RecruiterToolbar,
} from './components/recruiter-m-components';

const RecruiterManagement = () => {
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

  // Mock data cho RecruiterVerification
  const mockVerificationData: RecruiterVerification[] = mockData.map(
    (user, index) => {
      const getVerificationStatus = (userStatus: string) => {
        switch (userStatus) {
          case 'Verified':
            return 'Verified';
          case 'Pending':
            return 'Pending';
          case 'Locked':
            return 'Rejected';
          default:
            return 'Pending';
        }
      };

      return {
        recruiterVerificationId: index + 1,
        userId: parseInt(user.userId),
        companyName: `Công ty TNHH ${user.fullName.split(' ')[1]} ${index + 1}`,
        companyAddress: `Tầng ${index + 1}, Tòa nhà ABC, ${
          user.address.split(',')[1] || 'Quận 1, TP.HCM'
        }`,
        companyPhone: `0${Math.floor(Math.random() * 900000000 + 100000000)}`,
        companyEmail: `contact@company${index + 1}.com`,
        taxCode: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        companyLicense: `${index + 1},${index + 2}`, // Mock document IDs
        verificationStatus: getVerificationStatus(user.status),
        rejectReason:
          user.status === 'Locked' ? 'Tài khoản vi phạm quy định' : '',
        verifiedAt:
          user.status === 'Verified'
            ? new Date(
                Date.now() -
                  Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
              )
            : undefined,
        createdAt: user.createdAt,
      };
    }
  );

  // Mock data cho CompanyDocument
  const mockDocumentsData: CompanyDocument[][] = mockData.map((user, index) => {
    const baseDate = new Date(user.createdAt);
    return [
      {
        documentId: index * 2 + 1,
        documentName: 'Giấy phép kinh doanh',
        documentFilePath: `https://example.com/docs/business-license-${
          index + 1
        }.pdf`,
        createdAt: baseDate,
      },
      {
        documentId: index * 2 + 2,
        documentName: 'Giấy phép hoạt động',
        documentFilePath: `https://example.com/docs/operation-license-${
          index + 1
        }.pdf`,
        createdAt: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // 1 ngày sau
      },
    ];
  });

  const [dataList] = useState<User[]>(mockData);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rankFilter, setRankFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [selectedVerification, setSelectedVerification] =
    useState<RecruiterVerification | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<CompanyDocument[]>(
    []
  );

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
        //api delete
      },
      cancelText: 'Hủy',
    });
  };

  const handlePreview = (data: User) => {
    setPreviewVisible(true);
    setSelectedItem(data);

    // Tìm verification data tương ứng
    const verification = mockVerificationData.find(
      (v) => v.userId === parseInt(data.userId)
    );
    setSelectedVerification(verification || null);

    // Tìm documents tương ứng
    const userIndex = mockData.findIndex((u) => u.userId === data.userId);
    const documents = userIndex >= 0 ? mockDocumentsData[userIndex] : [];
    setSelectedDocuments(documents);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <RecruiterPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <RecruiterToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          rankFilter={rankFilter}
          onRankFilterChange={setRankFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedRowKeys={selectedRowKeys}
        />

        <RecruiterTable
          dataList={filteredData}
          onPreview={handlePreview}
          onLock={handleLock}
        />
      </div>

      <RecruiterPreviewDrawer
        data={selectedItem}
        onClose={() => setPreviewVisible(false)}
        visible={previewVisible}
        verificationData={selectedVerification || undefined}
        documents={selectedDocuments}
      />
    </div>
  );
};

export default RecruiterManagement;
