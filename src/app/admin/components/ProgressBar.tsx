export function ProgressBar({ 
  label, 
  value, 
  total, 
  colorClass = "bg-blue-500", 
  format = "count" 
}: { 
  label: string; 
  value: number; 
  total: number; 
  colorClass?: string;
  format?: "count" | "percentage";
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-800 font-bold">
          {format === "percentage" ? `${percentage}%` : `${value} / ${total}`}
        </span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
