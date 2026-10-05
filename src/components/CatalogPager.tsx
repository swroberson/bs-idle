import { CatalogSelect } from "./CatalogSelect";

export function CatalogPager({ labels, index, select, name, unseen }: {
  labels: string[]; index: number; select: (index: number) => void; name: string; unseen?: boolean[];
}) {
  if (!labels.length) return null;
  return <div className="catalog-controls" aria-label={`${name} pages`}>
    <button className="machine-button" aria-label={`Previous ${name} entry`} title="Previous" disabled={index === 0} onClick={() => select(index - 1)}>←</button>
    <CatalogSelect labels={labels} index={index} select={select} name={name} unseen={unseen} />
    <button className="machine-button" aria-label={`Next ${name} entry`} title="Next" disabled={index === labels.length - 1} onClick={() => select(index + 1)}>→</button>
    <span className="telemetry">{index + 1} / {labels.length}</span>
  </div>;
}
