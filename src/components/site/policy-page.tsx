export function PolicyPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="eyebrow mb-3">The Ritual Era</p>
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <div className="mt-8 space-y-4 text-sm font-light leading-relaxed text-washed">
        <p>{body}</p>
      </div>
    </div>
  );
}
