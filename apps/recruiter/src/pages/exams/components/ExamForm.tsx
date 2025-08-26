import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Card,
  Button,
  Statistic,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ExamFormProps {
  currentStep: number;
}

const ExamForm: React.FC<ExamFormProps> = ({ currentStep }) => {
  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <div className="step-content">
          <Form.Item
            label="Tên kỳ thi"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên kỳ thi' }]}
          >
            <Input placeholder="VD: Tuyển dụng Frontend Developer" />
          </Form.Item>

          <Form.Item
            label="Vị trí tuyển dụng"
            name="position"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
          >
            <Select placeholder="Chọn vị trí">
              <Option value="frontend">Frontend Developer</Option>
              <Option value="backend">Backend Developer</Option>
              <Option value="fullstack">Fullstack Developer</Option>
              <Option value="mobile">Mobile Developer</Option>
              <Option value="devops">DevOps Engineer</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} placeholder="Mô tả về kỳ thi này..." />
          </Form.Item>

          <Form.Item
            label="Chủ đề kiến thức"
            name="topics"
            rules={[
              { required: true, message: 'Vui lòng chọn ít nhất 1 chủ đề' },
            ]}
          >
            <Select mode="multiple" placeholder="Chọn chủ đề">
              <Option value="javascript">JavaScript</Option>
              <Option value="react">React</Option>
              <Option value="nodejs">Node.js</Option>
              <Option value="database">Database</Option>
              <Option value="algorithms">Algorithms</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Thời gian thi (phút)"
            name="duration"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <Input type="number" placeholder="90" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Cấu hình đề thi',
      content: (
        <div className="step-content">
          <div className="question-bank-section">
            <h3>Ngân hàng câu hỏi</h3>
            <Upload>
              <Button icon={<UploadOutlined />}>
                Tải lên file câu hỏi (Excel/CSV)
              </Button>
            </Upload>
            <p className="upload-note">
              Hỗ trợ file Excel (.xlsx) hoặc CSV.{' '}
              <a href="#template" style={{ color: 'var(--color-primary)' }}>
                Tải template
              </a>
            </p>
          </div>

          <div className="exam-config-section">
            <div className="config-cards">
              <Card title="Cấu hình đề thi">
                <div>
                  <Form.Item label="Số câu hỏi" name="totalQuestions">
                    <Input type="number" defaultValue="25" />
                  </Form.Item>

                  <Form.Item label="Độ khó" name="difficulty">
                    <div>
                      <label htmlFor="easy-checkbox">
                        <input
                          id="easy-checkbox"
                          type="checkbox"
                          style={{ marginRight: '8px' }}
                          defaultChecked
                        />{' '}
                        Dễ (40%)
                      </label>
                      <br />
                      <label htmlFor="medium-checkbox">
                        <input
                          id="medium-checkbox"
                          type="checkbox"
                          style={{ marginRight: '8px' }}
                          defaultChecked
                        />{' '}
                        Trung bình (50%)
                      </label>
                      <br />
                      <label htmlFor="hard-checkbox">
                        <input
                          id="hard-checkbox"
                          type="checkbox"
                          style={{ marginRight: '8px' }}
                        />{' '}
                        Khó (10%)
                      </label>
                    </div>
                  </Form.Item>

                  <div>
                    <h4>Quy tắc chấm điểm:</h4>
                    <div>Đúng: +1 điểm</div>
                    <div>Sai: -0.25 điểm</div>
                    <div>Bỏ trống: 0 điểm</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian thi',
      content: (
        <div className="step-content">
          <Form.Item
            label="Cửa sổ thời gian thi"
            name="examPeriod"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={['Bắt đầu', 'Kết thúc']}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div className="time-summary">
            <Statistic title="Số câu hỏi" value={25} />
            <Statistic title="Thời gian thi" value="90 phút" />
            <Statistic title="Điểm tối đa" value={25} />
          </div>
        </div>
      ),
    },
    {
      title: 'Xác nhận',
      content: (
        <div className="step-content">
          <div className="exam-preview">
            <h3>Thông tin kỳ thi</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <div>
                <strong>Tên:</strong> Tuyển dụng Frontend Developer
              </div>
              <div>
                <strong>Vị trí:</strong> Frontend Developer
              </div>
              <div>
                <strong>Chủ đề:</strong> JavaScript, React, HTML/CSS
              </div>
              <div>
                <strong>Thời gian:</strong> 90 phút
              </div>
              <div>
                <strong>Số câu:</strong> 25
              </div>
              <div>
                <strong>Cửa sổ thi:</strong> 15/01/2024 09:00 - 20/01/2024 18:00
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <div>{steps[currentStep].content}</div>;
};

export default ExamForm;
