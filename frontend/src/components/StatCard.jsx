/**
 * Compact metric tile used in the dashboard hero.
 */
export default function StatCard({ icon: Icon, value, label, testId }) {
  return (
    <div className="stat-card" data-testid={testId}>
      <span className="stat-card__icon">
        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </span>
    </div>
  );
}
