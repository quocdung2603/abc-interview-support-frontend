import { Button, Drawer, Input, notification, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { RecruitmentNews, Field } from '@abc-interview-support-frontend/types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { questionService } from '@abc-interview-support-frontend/services';

interface JobFormDrawerProps {
  initForm?: RecruitmentNews; // undefined => tạo mới; có giá trị => sửa
  visible: boolean;
  onClose: () => void;
  onSave: (data: RecruitmentNews, mode: 'create' | 'update') => void;
}

const JobFormDrawer: React.FC<JobFormDrawerProps> = ({
  initForm,
  visible,
  onClose,
  onSave,
}) => {
  const [fields, setFields] = useState<Field[]>([]);

  const defaultFormValue: Partial<RecruitmentNews> = {
    title: '',
    content: '',
    position: '',
    location: '',
    salary: '',
    experience: '',
    workingHours: '',
    deadline: '',
    applicationMethod: '',
    companyName: '',
    fieldId: undefined,
    examId: undefined,
    expiredAt: '',
  };

  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RecruitmentNews>({
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

  const onSubmit: SubmitHandler<RecruitmentNews> = async (data) => {
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
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Mức lương</p>
          <Controller
            name="salary"
            control={control}
            rules={{ required: 'Vui lòng nhập mức lương' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Ví dụ: 2000-3000 USD hoặc Thỏa thuận"
                {...field}
              />
            )}
          />
          {errors.salary && (
            <span className="text-red-500">{errors.salary.message}</span>
          )}
        </div>
        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Tên công ty</p>
          <Controller
            name="companyName"
            control={control}
            rules={{ required: 'Vui lòng nhập tên công ty' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Nhập tên công ty..."
                {...field}
              />
            )}
          />
          {errors.companyName && (
            <span className="text-red-500">{errors.companyName.message}</span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Kinh nghiệm yêu cầu</p>
          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Ví dụ: 3-5 năm hoặc Fresher"
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Giờ làm việc</p>
          <Controller
            name="workingHours"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Ví dụ: 9AM-6PM"
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Phương thức ứng tuyển</p>
          <Controller
            name="applicationMethod"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Ví dụ: Gửi CV về hr@company.com"
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Lĩnh vực</p>
          <Controller
            name="fieldId"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Chọn lĩnh vực"
                style={{ width: '100%' }}
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
          <p className="text-[16px] text-[grey]">ID bài thi (tùy chọn)</p>
          <Controller
            name="examId"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                placeholder="Nhập ID bài thi..."
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] text-[grey]">Ngày hết hạn (tùy chọn)</p>
          <Controller
            name="expiredAt"
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                placeholder="Chọn ngày hết hạn..."
                {...field}
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
            )}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default JobFormDrawer;
