import { Button, Drawer, Input, Select, DatePicker, notification } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { News, Field, AuthUser } from '@abc-interview-support-frontend/types';
import { questionService, newsService } from '@abc-interview-support-frontend/services';

const defaultFormValue: Partial<News> = {
  title: '',
  content: '',
  newsType: 'NEWS',
  fieldId: undefined,
  expiredAt: undefined,
};

interface TrendNewsFormDrawerProps {
  initForm?: News; // undefined => tạo mới; có giá trị => sửa
  visible: boolean;
  onClose: () => void;
  onSave: (data: News, mode: 'create' | 'update') => void;
  user: AuthUser | null;
}

const TrendNewsFormDrawer: React.FC<TrendNewsFormDrawerProps> = ({
  initForm,
  visible,
  onClose,
  onSave,
  user,
}) => {
  const [fields, setFields] = useState<Field[]>([]);

  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);
  const canEdit = useMemo(() => initForm?.status === 'PENDING', [initForm]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<News>>({
    defaultValues: defaultFormValue,
  });

  // Fetch fields on mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await questionService.getAllFields();
        setFields(res.content || []);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setFields([]);
      }
    };
    fetchFields();
  }, []);

  // Reset form mỗi khi mở Drawer hoặc đổi initForm
  useEffect(() => {
    if (!visible) return;
    if (initForm) reset(initForm);
    else reset(defaultFormValue);
  }, [visible, initForm, reset]);

  const onSubmit: SubmitHandler<Partial<News>> = async (data) => {
    try {
      let result: News;
      if (isEdit && initForm) {
        result = await newsService.updateNews(initForm.id, data);
        onSave(result, 'update');
      } else {
        const createData = {
          ...data,
          userId: user?.userId || '1',
          status: 'PENDING' as const,
          createdAt: new Date().toISOString(),
        };
        result = await newsService.createNews(createData);
        onSave(result, 'create');
      }
      notification.success({
        message: `${isEdit ? 'Cập nhật' : 'Tạo'} tin tức thành công`,
      });
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
      notification.error({
        message: 'Có lỗi xảy ra, vui lòng kiểm tra lại!',
      });
    }
  };

  return (
    <Drawer
      title={`${isEdit ? 'Cập nhật' : 'Khởi tạo'} tin tức`}
      width={900}
      open={visible}
      onClose={onClose}
      destroyOnHidden={false}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            gap: 'var(--spacing-md)',
          }}
        >
          <Button onClick={onClose}>Đóng</Button>
          <Button
            type="primary"
            htmlType="submit"
            form="TrendNewsForm"
            disabled={!canEdit && isEdit}
          >
            {isEdit ? 'Cập nhật' : 'Khởi tạo'}
          </Button>
        </div>
      }
    >
      {isEdit && !canEdit && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '6px' }}>
          <p style={{ color: '#cf1322', margin: 0, fontWeight: 'bold' }}>
            Cảnh báo: Chỉ có thể chỉnh sửa tin tức có trạng thái "Chờ duyệt"
          </p>
        </div>
      )}

      <form id="TrendNewsForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Tiêu đề tin</p>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Vui lòng nhập tiêu đề' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Nhập tiêu đề..."
                disabled={!canEdit && isEdit}
                {...field}
              />
            )}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Nội dung</p>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Vui lòng nhập nội dung' }}
            render={({ field }) => (
              <Input.TextArea
                placeholder="Nhập nội dung..."
                rows={6}
                disabled={!canEdit && isEdit}
                {...field}
              />
            )}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Lĩnh vực</p>
          <Controller
            name="fieldId"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Select
                placeholder="Chọn lĩnh vực"
                style={{ width: '100%' }}
                disabled={!canEdit && isEdit}
                value={value}
                onChange={(val) => onChange(val)}
                {...field}
              >
                {fields.map((field) => (
                  <Select.Option key={field.id} value={field.id}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Ngày hết hạn</p>
          <Controller
            name="expiredAt"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <DatePicker
                placeholder="Chọn ngày hết hạn"
                style={{ width: '100%' }}
                disabled={!canEdit && isEdit}
                value={value ? dayjs(value) : null}
                onChange={(date) => onChange(date ? date.toISOString() : undefined)}
                {...field}
              />
            )}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default TrendNewsFormDrawer;
