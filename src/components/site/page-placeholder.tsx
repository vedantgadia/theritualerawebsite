export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="eyebrow mb-3">The Ritual Era</p>
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-4 text-sm font-light text-washed">This page is being dressed — check back in a moment.</p>
    </div>
  );
}
