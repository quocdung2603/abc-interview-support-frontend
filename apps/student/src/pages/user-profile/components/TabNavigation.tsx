import React from 'react';

interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
    description: string;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      className="card-elevated"
      style={{ marginBottom: 'var(--spacing-lg)', padding: 0 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          borderBottom: '2px solid var(--color-neutral-200)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-neutral-300) transparent',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              border: 'none',
              backgroundColor:
                activeTab === tab.id ? 'var(--color-accent-10)' : 'transparent',
              borderBottom: `3px solid ${
                activeTab === tab.id ? 'var(--color-accent)' : 'transparent'
              }`,
              color:
                activeTab === tab.id
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor =
                  'var(--color-neutral-50)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-neutral-600)';
              }
            }}
          >
            <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                }}
              >
                {tab.label}
                {tab.badge && (
                  <span
                    className="badge-accent"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.4rem',
                      minWidth: '1.2rem',
                      textAlign: 'center',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    activeTab === tab.id
                      ? 'var(--color-accent-dark)'
                      : 'var(--color-neutral-500)',
                  fontWeight: '400',
                }}
              >
                {tab.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab indicator */}
      <div
        style={{
          height: '2px',
          backgroundColor: 'var(--color-accent)',
          transition: 'all 0.3s ease',
          marginTop: '-2px',
        }}
      />
    </div>
  );
};

export default TabNavigation;
