"use client";

import { useLang } from "@/lib/i18n";

const box = "w-full rounded-xl bg-bg-elevated border border-glass-border px-3 py-2.5 text-sm text-primary-text placeholder:text-secondary-text/70 focus:outline-none focus:ring-1 focus:ring-primary-500";

// A grid of preset buttons (styles, scenes, rooms…) with an optional one-line description.
export function PresetGrid({ label, items, value, onChange, cols = 2 }) {
  const { tx } = useLang();
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-primary-text">{tx(label)}</div>
      <div className={`grid gap-2 ${cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
        {items.map((s) => (
          <button key={s.id} type="button" onClick={() => onChange(s.id)} aria-pressed={value === s.id}
            className={`text-left rounded-xl border px-3 py-2 transition-colors ${value === s.id
              ? "border-primary-500 bg-primary-500/15 text-primary-text" : "border-glass-border bg-bg-elevated text-secondary-text hover:text-primary-text"}`}>
            <span className="block text-xs font-semibold">{tx(s.label)}</span>
            {s.desc && <span className="block text-[11px] opacity-80 mt-0.5">{tx(s.desc)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Chips with { id, label } items.
export function LabeledChips({ label, items, value, onChange }) {
  const { tx } = useLang();
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-primary-text">{tx(label)}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((o) => (
          <button key={o.id} type="button" onClick={() => onChange(o.id)} aria-pressed={value === o.id}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${value === o.id
              ? "bg-primary-500/20 border-primary-500 text-primary-text"
              : "bg-bg-elevated border-glass-border text-secondary-text hover:text-primary-text"}`}>
            {tx(o.label)}
          </button>
        ))}
      </div>
    </div>
  );
}

// One text field (input or textarea) with a label in two languages.
export function TextField({ id, label, value, onChange, placeholder, max = 200, rows = 0, required = false }) {
  const { tx } = useLang();
  const common = {
    id, value: value || "", maxLength: max, placeholder: tx(placeholder) || "",
    onChange: (e) => onChange(e.target.value), className: `${box}${rows ? " resize-none" : ""}`,
  };
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-primary-text">
        {tx(label)}{required && <span className="text-primary-500"> *</span>}
      </label>
      {rows ? <textarea rows={rows} {...common} /> : <input {...common} />}
    </div>
  );
}

// A checkbox with a label (e.g. confirming the rights to a photo).
export function Check({ id, checked, onChange, children }) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 rounded-xl border border-glass-border bg-bg-elevated px-3 py-2.5 cursor-pointer">
      <input id={id} type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[var(--primary)] shrink-0" />
      <span className="text-xs leading-relaxed text-primary-text">{children}</span>
    </label>
  );
}
