export default function LiveIndicator({ label = "Live" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </div>
  );
}