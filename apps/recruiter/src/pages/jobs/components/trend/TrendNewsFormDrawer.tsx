import { Button, Drawer, Input, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TrendNews } from './types';

interface TrendNewsFormDrawerProps {
  initForm?: TrendNews; // undefined => tạo mới; có giá trị => sửa
  visible: boolean;
  onClose: () => void;
  onSave: (data: TrendNews, mode: 'create' | 'update') => void;
}

const TrendNewsFormDrawer: React.FC<TrendNewsFormDrawerProps> = ({
  initForm,
  visible,
  onClose,
  onSave,
}) => {
  const defaultFormValue: TrendNews = {
    id: '', // để khớp type TrendNewsPost khi update
    title: '',
    content: '',
    category: 'technology',
    status: 'draft',
  };

  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TrendNews>({
    defaultValues: defaultFormValue,
  });

  // Reset form mỗi khi mở Drawer hoặc đổi initForm
  useEffect(() => {
    if (!visible) return;
    if (initForm) reset(initForm);
    else reset(defaultFormValue);
  }, [visible, initForm, reset]);

  const onSubmit: SubmitHandler<TrendNews> = async (data) => {
    try {
      if (isEdit) {
        onSave({ ...initForm!, ...data }, 'update');
      } else {
        onSave(data, 'create');
      }
    } catch (e) {
      notification.error({
        message: 'Có lỗi xảy ra, vui lòng kiểm tra lại!' + e,
      });
    }
  };

  return (
    <Drawer
      title={`${isEdit ? 'Cập nhật' : 'Khởi tạo'} tin tuyển dụng`}
      width={900}
      open={visible}
      onClose={onClose}
      destroyOnHidden={false} // dùng reset nên không cần unmount
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            gap: 'var(--spacing-md)',
          }}
        >
          <Button onClick={onClose}>Đóng</Button>
          {/* Submit form từ footer */}
          <Button type="primary" htmlType="submit" form="TrendNewsForm">
            {isEdit ? 'Cập nhật' : 'Khởi tạo'}
          </Button>
        </div>
      }
    >
      <form id="TrendNewsForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Tiêu đề tin</p>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Vui lòng nhập tiêu đề' }}
            render={({ field }) => (
              <Input type="text" placeholder="Nhập tiêu đề..." {...field} />
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
            rules={{ required: 'Vui lòng nhập' }}
            render={({ field }) => (
              <Input type="text" placeholder="Nhập ..." {...field} />
            )}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Danh mục tin tức</p>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Vui lòng nhập địa điểm làm việc' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Nhập vị trí địa điểm làm việc..."
                {...field}
              />
            )}
          />
          {errors.category && (
            <span className="text-red-500">{errors.category.message}</span>
          )}
        </div>
        <div className="mb-4 flex justify-center items-center space-x-5">
          <div className="w-1/3">
            <p className="text-[16px] text-[grey]">Trạng thái</p>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Vui lòng nhập Mức lương tối thiểu' }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Nhập Mức lương tối thiểu..."
                  {...field}
                />
              )}
            />
            {errors.status && (
              <span className="text-red-500">{errors.status.message}</span>
            )}
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default TrendNewsFormDrawer;
