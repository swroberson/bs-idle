export function CatalogPager({ labels, index, select, name }: {
  labels: string[]; index: number; select: (index: number) => void; name: string;
}) {
  if (!labels.length) return null;
  return <div className="catalog-controls" aria-label={`${name} pages`}>
    <label className="sr-only" htmlFor={`${name}-page`}>{name} entry</label>
    <button className="machine-button" aria-label={`Previous ${name} entry`} title="Previous" disabled={index === 0} onClick={() => select(index - 1)}>←</button>
    <select id={`${name}-page`} value={index} onChange={event => select(Number(event.target.value))}>
      {labels.map((label, i) => <option key={label} value={i}>{label}</option>)}
    </select>
    <button className="machine-button" aria-label={`Next ${name} entry`} title="Next" disabled={index === labels.length - 1} onClick={() => select(index + 1)}>→</button>
    <span className="telemetry">{index + 1} / {labels.length}</span>
  </div>;
}
