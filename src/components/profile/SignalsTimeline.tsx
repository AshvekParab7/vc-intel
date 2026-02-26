// Static placeholder signals timeline.
// In a real product these would be fetched from a signals API.

// ─── Types ────────────────────────────────────────────────────────────────────

type SignalType = "funding" | "product" | "hire" | "news" | "partnership";

interface Signal {
  type: SignalType;
  title: string;
  description: string;
  date: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const SIGNALS: Signal[] = [
  {
    type: "funding",
    title: "Funding round closed",
    description: "Company raised a new round, bringing total funding to a new milestone.",
    date: "Jan 2024",
  },
  {
    type: "product",
    title: "New product feature launched",
    description: "Shipped a major update to core product with expanded enterprise capabilities.",
    date: "Oct 2023",
  },
  {
    type: "hire",
    title: "Key executive hire",
    description: "Appointed a new VP of Growth with a strong track record in B2B SaaS scaling.",
    date: "Aug 2023",
  },
  {
    type: "news",
    title: "Featured in industry press",
    description: "Recognised as a top innovator in its category by a leading industry publication.",
    date: "May 2023",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const SIGNAL_CONFIG: Record<
  SignalType,
  { bg: string; icon: React.ReactNode }
> = {
  funding: {
    bg: "bg-emerald-50 border-emerald-200 text-emerald-600",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  product: {
    bg: "bg-indigo-50 border-indigo-200 text-indigo-600",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  hire: {
    bg: "bg-violet-50 border-violet-200 text-violet-600",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  news: {
    bg: "bg-amber-50 border-amber-200 text-amber-600",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  partnership: {
    bg: "bg-teal-50 border-teal-200 text-teal-600",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignalsTimeline() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Signals
        </h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-600">
          Placeholder
        </span>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
        {SIGNALS.map((signal, i) => {
          const config = SIGNAL_CONFIG[signal.type];
          return (
            <div key={i} className="flex gap-4 px-5 py-4">
              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${config.bg}`}
                >
                  {config.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-800">
                    {signal.title}
                  </p>
                  <span className="text-xs text-zinc-400 shrink-0">
                    {signal.date}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed">
                  {signal.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
