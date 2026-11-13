export function StudioSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface animate-pulse">
      <div className="aspect-[16/10] w-full bg-surface-secondary" />
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="h-5 w-3/4 rounded bg-surface-secondary" />
        <div className="h-4 w-1/2 rounded bg-surface-secondary" />
        <div className="h-10 w-full rounded bg-surface-secondary" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 rounded bg-surface-secondary" />
          <div className="h-5 w-16 rounded bg-surface-secondary" />
        </div>
        <div className="mt-auto border-t border-border pt-4 flex justify-between">
          <div className="h-4 w-20 rounded bg-surface-secondary" />
          <div className="h-5 w-16 rounded bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

