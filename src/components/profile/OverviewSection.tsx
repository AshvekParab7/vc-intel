import Badge from "@/components/ui/Badge";
import { getSectorColor, getStageColor } from "@/lib/utils";
import type { Company } from "@/lib/types";

// ─── Helper ───────────────────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-zinc-700">{value}</dd>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OverviewSection({ company }: { company: Company }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Overview
      </h2>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-5">
        {/* Description */}
        {company.description && (
          <p className="text-sm leading-relaxed text-zinc-600">
            {company.description}
          </p>
        )}

        {/* Meta grid */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <MetaRow label="Founded" value={company.founded} />
          <MetaRow label="Employees" value={company.employees} />
          <MetaRow label="Location" value={company.location} />
          <MetaRow label="Revenue" value={company.revenue ?? "Undisclosed"} />
        </dl>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
          <span className="text-xs text-zinc-400 mr-1">Tags</span>
          <Badge label={company.sector} className={getSectorColor(company.sector)} />
          <Badge label={company.stage} className={getStageColor(company.stage)} />
          <Badge
            label={company.location}
            className="bg-zinc-100 text-zinc-600 border border-zinc-200"
          />
        </div>
      </div>
    </section>
  );
}
