import { Button } from 'antd';
import { SessionInfo } from './types';

interface SessionManagerProps {
  sessions: SessionInfo[];
  onLogoutSession: (sessionId: string) => Promise<void>;
  onLogoutAllSessions: () => Promise<void>;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  onLogoutSession,
  onLogoutAllSessions,
}) => {
  const handleLogoutSession = async (sessionId: string) => {
    try {
      await onLogoutSession(sessionId);
    } catch (error) {
      console.error('Logout session error:', error);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      await onLogoutAllSessions();
    } catch (error) {
      console.error('Logout all sessions error:', error);
    }
  };

  return (
    <>
      <h3>Phiên đăng nhập</h3>
      <div className="session-info">
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {session.isCurrent ? 'Phiên hiện tại' : 'Phiên khác'}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {session.browser} trên {session.os} - {session.ip}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Hoạt động cuối: {session.lastActivity}
              </div>
            </div>
            <Button
              size="small"
              danger
              onClick={() => handleLogoutSession(session.id)}
              disabled={session.isCurrent}
            >
              {session.isCurrent ? 'Phiên hiện tại' : 'Đăng xuất'}
            </Button>
          </div>
        ))}
      </div>

      <Button danger onClick={handleLogoutAllSessions}>
        Đăng xuất tất cả phiên
      </Button>
    </>
  );
};

export default SessionManager;
