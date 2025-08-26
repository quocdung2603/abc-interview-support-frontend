import { Button } from 'antd';

const NotVerifiedState: React.FC = () => {
  return (
    <div className="page-container">
      <div className="not-verified-state">
        <div className="illustration">⚙️</div>
        <h2>Cần xác thực doanh nghiệp</h2>
        <p>
          Bạn cần hoàn tất xác thực doanh nghiệp để truy cập cài đặt hệ thống.
        </p>
        <Button type="primary" href="/verification">
          Xác thực ngay
        </Button>
      </div>
    </div>
  );
};

export default NotVerifiedState;
