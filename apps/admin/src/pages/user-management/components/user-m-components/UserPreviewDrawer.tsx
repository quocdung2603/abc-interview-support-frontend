import React from 'react';
import { Drawer } from 'antd';
import { User } from '@abc-interview-support-frontend/types';
import StatusTag from './StatusTag';
interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: User | null;
}

const UserPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
}) => {
  return (
    <Drawer
      title="Xem trước bài đăng"
      width={900}
      open={visible}
      onClose={onClose}
    >
      {data && (
        <div>
          <div
            className="text-heading-3"
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            {data.fullName}
          </div>

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div>
              <strong>Email:</strong> {data.email}
            </div>
            <div>
              <strong>Ngày sinh:</strong>{' '}
              {new Date(data.dateOfBirth).toLocaleDateString('vi-VN')}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {data.address}
            </div>
            <div>
              <strong>Tình trạng học tập:</strong>{' '}
              <StatusTag
                status={data.isStudying ? 'Đang học' : 'Đã tốt nghiệp'}
                type={'is-studying'}
              />
            </div>
            <div>
              <strong>Trạng thái tài khoản:</strong>{' '}
              <StatusTag status={data.status} type={'status-account'} />
            </div>
            <div>
              <strong>Điểm xếp hạng:</strong>
              {data.eloScore}
            </div>
            <div>
              <strong>Bậc xếp hạng:</strong>{' '}
              <StatusTag status={data.eloRank} type={'elo-rank'} />
            </div>
          </div>
          <div>
            <strong>Ngày tạo tài khoản:</strong>{' '}
            {new Date(data.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default UserPreviewDrawer;
