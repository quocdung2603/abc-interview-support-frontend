import React from 'react';
import { Drawer, Card, Descriptions, Typography, Tag } from 'antd';
import { Level } from '@abc-interview-support-frontend/types';

const { Title, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Level | null;
}

const LevelPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
}) => {
  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Xem</span>
          <span>Xem trước mức độ</span>
        </div>
      }
      width={800}
      open={visible}
      onClose={onClose}
      styles={{ body: { padding: '24px' } }}
    >
      {data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Mô tả</span>
                <span>Thông tin mức độ</span>
              </div>
            }
            style={{
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px'
            }}
          >
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{
                fontWeight: '600',
                color: 'var(--color-text-secondary, #666)',
                width: '120px'
              }}
              contentStyle={{
                color: 'var(--color-text-primary, #333)'
              }}
            >
              <Descriptions.Item label="ID">
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                  #{data.id}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tên mức độ">
                <Title level={4} style={{ margin: 0, color: 'var(--color-primary, #1890ff)' }}>
                  {data.name}
                </Title>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <Text style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: data.description ? 'var(--color-text-primary, #333)' : 'var(--color-text-secondary, #999)'
                }}>
                  {data.description || 'Không có mô tả'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'var(--color-text-secondary, #999)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '24px', marginBottom: '16px', display: 'block', fontWeight: 'bold' }}>Chi tiết Mức độ</span>
            <Text>Không có dữ liệu để hiển thị</Text>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default LevelPreviewDrawer;