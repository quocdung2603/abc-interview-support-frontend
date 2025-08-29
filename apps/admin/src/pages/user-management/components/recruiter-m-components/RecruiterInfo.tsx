import { User } from '@abc-interview-support-frontend/types';
import React from 'react';
import StatusTag from './StatusTag';

interface InfoProps {
  data: User;
}

const RecruiterInfo: React.FC<InfoProps> = ({ data }) => {
  return (
    <div>
      <div
        className="text-heading-3"
        style={{ marginBottom: 'var(--spacing-md)' }}
      >
        {data?.fullName}
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <strong>Email:</strong> {data?.email}
        </div>
        <div>
          <strong>Ngày sinh:</strong>{' '}
          {new Date(data.dateOfBirth).toLocaleDateString('vi-VN')}
        </div>
        <div>
          <strong>Địa chỉ:</strong> {data.address}
        </div>
        <div>
          <strong>Trạng thái tài khoản:</strong>{' '}
          <StatusTag status={data.status} />
        </div>
      </div>
      <div>
        <strong>Ngày tạo tài khoản:</strong>{' '}
        {new Date(data.createdAt).toLocaleDateString('vi-VN')}
      </div>
    </div>
  );
};

export default RecruiterInfo;
