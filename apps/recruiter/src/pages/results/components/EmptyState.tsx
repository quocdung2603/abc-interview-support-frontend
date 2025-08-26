interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📈',
}) => {
  return (
    <div className="empty-state">
      <div className="illustration">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default EmptyState;
