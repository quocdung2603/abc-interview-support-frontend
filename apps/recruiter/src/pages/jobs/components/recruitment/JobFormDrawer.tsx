import { Button, Drawer, Input, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { JobPost } from './types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface JobFormDrawerProps {
  initForm?: JobPost; // undefined => tạo mới; có giá trị => sửa
  visible: boolean;
  onClose: () => void;
  onSave: (data: JobPost, mode: 'create' | 'update') => void;
}

const JobFormDrawer: React.FC<JobFormDrawerProps> = ({
  initForm,
  visible,
  onClose,
  onSave,
}) => {
  const defaultFormValue: JobPost = {
    id: '', // để khớp type JobPost khi update
    title: '',
    position: '',
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'VND',
    deadline: '',
    status: 'draft',
    createdAt: '',
    updatedAt: '',
  };

  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPost>({
    defaultValues: defaultFormValue,
  });

  // Reset form mỗi khi mở Drawer hoặc đổi initForm
  useEffect(() => {
    if (!visible) return;
    if (initForm) reset(initForm);
    else reset(defaultFormValue);
  }, [visible, initForm, reset]);

  const onSubmit: SubmitHandler<JobPost> = async (data) => {
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
          <Button type="primary" htmlType="submit" form="jobForm">
            {isEdit ? 'Cập nhật' : 'Khởi tạo'}
          </Button>
        </div>
      }
    >
      <form id="jobForm" onSubmit={handleSubmit(onSubmit)}>
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
          <p className="text-[16px] text-[grey]">Vị trí cần tuyển</p>
          <Controller
            name="position"
            control={control}
            rules={{ required: 'Vui lòng nhập vị trí cần tuyển' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Nhập vị trí cần tuyển..."
                {...field}
              />
            )}
          />
          {errors.position && (
            <span className="text-red-500">{errors.position.message}</span>
          )}
        </div>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Địa điểm làm việc</p>
          <Controller
            name="location"
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
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>
        <div className="mb-4 flex justify-center items-center space-x-5">
          <div className="w-1/3">
            <p className="text-[16px] text-[grey]">Mức lương tối thiểu</p>
            <Controller
              name="salaryMin"
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
            {errors.location && (
              <span className="text-red-500">{errors.location.message}</span>
            )}
          </div>
          <div className="w-1/3">
            <p className="text-[16px] text-[grey]">Mức lương tối đa</p>
            <Controller
              name="salaryMax"
              control={control}
              rules={{ required: 'Vui lòng nhập Mức lương tối đa' }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Nhập Mức lương tối đa..."
                  {...field}
                />
              )}
            />
            {errors.location && (
              <span className="text-red-500">{errors.location.message}</span>
            )}
          </div>
          <div className="w-1/3">
            <p className="text-[16px] text-[grey]">Đơn vị tiền tệ lương</p>
            <Controller
              name="salaryCurrency"
              control={control}
              rules={{ required: 'Vui lòng nhập Đơn vị tiền tệ lương' }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Nhập Đơn vị tiền tệ lương..."
                  {...field}
                />
              )}
            />
            {errors.location && (
              <span className="text-red-500">{errors.location.message}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Thời hạn nhận CV</p>
          <Controller
            name="deadline"
            control={control}
            rules={{ required: 'Vui lòng nhập Thời hạn nhận CV' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Nhập Thời hạn nhận CV..."
                {...field}
              />
            )}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>
      </form>
    </Drawer>
  );
};

export default JobFormDrawer;
