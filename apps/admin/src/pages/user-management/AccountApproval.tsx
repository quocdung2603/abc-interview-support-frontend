import { useState } from 'react';
import {
  AccountApprovalPageHeader,
  AccountApprovalTable,
  AccountApprovalToolbar,
  AccountApprovalFormDrawer,
} from './components/account-approval';
import {
  RecruiterVerification,
  CompanyDocument,
} from '@abc-interview-support-frontend/types';

const AccountApproval = () => {
  // Mock data cho RecruiterVerification với status Pending
  const mockVerificationData: RecruiterVerification[] = Array.from(
    { length: 5 },
    (_, i) => {
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

      const createdAt = new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );

      return {
        recruiterVerificationId: i + 1,
        userId: i + 1,
        companyName: `Công ty TNHH ${
          ['Tech', 'Digital', 'Innovation', 'Future', 'Global'][i % 5]
        } ${i + 1}`,
        companyAddress: `Tầng ${i + 1}, Tòa nhà ABC, đường ${
          streets[i % streets.length]
        }, ${districts[i % districts.length]}`,
        companyPhone: `0${Math.floor(Math.random() * 900000000 + 100000000)}`,
        companyEmail: `contact@company${i + 1}.com`,
        taxCode: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        companyLicense: `${i + 1},${i + 2}`, // Mock document IDs
        verificationStatus: 'Pending',
        rejectReason: '', // Empty for pending requests
        createdAt,
      };
    }
  );

  // Mock data cho CompanyDocument
  const mockDocumentsData: CompanyDocument[][] = mockVerificationData.map(
    (verification, index) => {
      const baseDate = new Date(verification.createdAt);
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
          createdAt: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000),
        },
        {
          documentId: index * 2 + 3,
          documentName: 'Giấy chứng nhận đăng ký thuế',
          documentFilePath: `https://example.com/docs/tax-certificate-${
            index + 1
          }.pdf`,
          createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      ];
    }
  );

  const [dataList] = useState<RecruiterVerification[]>(mockVerificationData);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedVerification, setSelectedVerification] =
    useState<RecruiterVerification | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<CompanyDocument[]>(
    []
  );

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.companyEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      item.companyAddress.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePreview = (data: RecruiterVerification) => {
    setPreviewVisible(true);
    setSelectedVerification(data);

    // Tìm documents tương ứng
    const verificationIndex = mockVerificationData.findIndex(
      (v) => v.recruiterVerificationId === data.recruiterVerificationId
    );
    const documents =
      verificationIndex >= 0 ? mockDocumentsData[verificationIndex] : [];
    setSelectedDocuments(documents);
  };

  const handleApprove = (
    data: RecruiterVerification,
    decision: 'Verified' | 'Rejected',
    rejectedReason?: string
  ) => {
    console.log('Approval decision:', { data, decision, rejectedReason });
    // Call API to update verification status
    setPreviewVisible(false);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <AccountApprovalPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <AccountApprovalToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedRowKeys={selectedRowKeys}
        />

        <AccountApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
        />
      </div>

      <AccountApprovalFormDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        verificationData={selectedVerification}
        documents={selectedDocuments}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default AccountApproval;
