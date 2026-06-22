export function MetricCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col">
      <h3 className="text-slate-500 text-sm font-medium tracking-wide mb-2 uppercase">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-800">{value}</span>
        {subtitle && <span className="text-slate-400 text-sm font-medium">{subtitle}</span>}
      </div>
    </div>
  );
}
