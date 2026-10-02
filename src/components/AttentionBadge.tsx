export function AttentionBadge({ count, label, warning = false }: {
  count: number;
  label: string;
  warning?: boolean;
}) {
  if (count === 0) return null;
  return <span className={`attention-badge ${warning ? "is-warning" : ""}`}>
    <span aria-hidden="true">{count > 99 ? "99+" : count}</span>
    <span className="sr-only">{count} {label}</span>
  </span>;
}
