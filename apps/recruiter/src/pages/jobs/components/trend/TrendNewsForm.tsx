import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Switch,
  Space,
  Button,
  Tag,
} from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { TrendNews } from './types';

interface TrendNewsFormProps {
  visible: boolean;
  news?: TrendNews | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const { TextArea } = Input;
const { Dragger } = Upload;

const TrendNewsForm: React.FC<TrendNewsFormProps> = ({
  visible,
  news,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>(news?.tags || []);
  const [inputTag, setInputTag] = useState('');

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      const newTags = [...tags, inputTag];
      setTags(newTags);
      form.setFieldsValue({ tags: newTags });
      setInputTag('');
    }
  };

  const handleRemoveTag = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    form.setFieldsValue({ tags: newTags });
  };

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      tags,
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/upload',
    accept: 'image/*',
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        console.error('Chỉ có thể upload file ảnh!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        console.error('Ảnh phải nhỏ hơn 5MB!');
      }
      return isImage && isLt5M;
    },
  };

  return (
    <Modal
      title={news ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          news || {
            status: 'draft',
            isFeature: false,
            category: 'technology',
          }
        }
        onFinish={handleSubmit}
        style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px 0' }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="summary"
          label="Tóm tắt"
          rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}
        >
          <TextArea rows={3} placeholder="Nhập tóm tắt ngắn gọn về bài viết" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục">
            <Select.Option value="technology">Công nghệ</Select.Option>
            <Select.Option value="career">Sự nghiệp</Select.Option>
            <Select.Option value="interview">Phỏng vấn</Select.Option>
            <Select.Option value="skills">Kỹ năng</Select.Option>
            <Select.Option value="industry">Ngành nghề</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tags">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Nhập tag"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onPressEnter={handleAddTag}
              />
              <Button
                type="primary"
                onClick={handleAddTag}
                icon={<PlusOutlined />}
              >
                Thêm
              </Button>
            </Space.Compact>
            <Space wrap>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  style={{ marginBottom: '8px' }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </Space>
        </Form.Item>

        <Form.Item name="featuredImage" label="Ảnh đại diện">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click hoặc kéo ảnh vào đây để upload
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ định dạng: JPG, PNG, GIF. Tối đa 5MB.
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <TextArea
            rows={10}
            placeholder="Nhập nội dung bài viết (có thể sử dụng HTML)"
          />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Select.Option value="draft">Bản nháp</Select.Option>
            <Select.Option value="pending">Chờ duyệt</Select.Option>
            <Select.Option value="published">Đã xuất bản</Select.Option>
            <Select.Option value="archived">Đã lưu trữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="isFeature" valuePropName="checked">
          <Switch checkedChildren="Nổi bật" unCheckedChildren="Thường" />
          <span style={{ marginLeft: '12px' }}>Đánh dấu là tin nổi bật</span>
        </Form.Item>

        {/* SEO Fields */}
        <div style={{ marginTop: '32px' }}>
          <h4>Cài đặt SEO</h4>
          <Form.Item name={['seo', 'metaTitle']} label="Meta Title">
            <Input placeholder="Tiêu đề SEO (tối đa 60 ký tự)" maxLength={60} />
          </Form.Item>

          <Form.Item name={['seo', 'metaDescription']} label="Meta Description">
            <TextArea
              rows={2}
              placeholder="Mô tả SEO (tối đa 160 ký tự)"
              maxLength={160}
            />
          </Form.Item>

          <Form.Item name={['seo', 'keywords']} label="Keywords">
            <Select
              mode="tags"
              placeholder="Thêm từ khóa SEO"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>

        <Form.Item
          style={{ marginBottom: 0, textAlign: 'right', marginTop: '32px' }}
        >
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {news ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TrendNewsForm;
