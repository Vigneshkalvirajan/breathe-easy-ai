import { Link } from "@tanstack/react-router";

const iconClass = "size-4 shrink-0";

function IconPulse() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h3l2 5 4-14 2 9h7" />
    </svg>
  );
}
function IconList() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h10M4 18h13" />
    </svg>
  );
}
function IconReport() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />
    </svg>
  );
}
function IconPatients() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7" />
      <path d="M9 12c0-2 1.5-3 3-3" />
    </svg>
  );
}

export function Sidebar({ active }: { active: "console" | "reports" }) {
  const base = "flex items-center gap-2.5 rounded-md px-2.5 py-2 cursor-pointer";
  const on = "bg-brand-soft text-brand font-medium";
  const off = "text-mute hover:text-ink";

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-md bg-brand font-display text-sm font-semibold text-surface">A</div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold">Auscio</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-mute">Respiratory DX</p>
        </div>
      </div>

      <nav className="mt-8 space-y-0.5 text-sm">
        <Link to="/" className={`${base} ${active === "console" ? on : off}`}>
          <IconPulse />
          Triage console
        </Link>
        <span className={`${base} ${off}`}>
          <IconList />
          Recordings
        </span>
        <Link to="/report" className={`${base} ${active === "reports" ? on : off}`}>
          <IconReport />
          Reports
        </Link>
        <span className={`${base} ${off}`}>
          <IconPatients />
          Patients
        </span>
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-lg bg-surface p-3 ring-1 ring-black/5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-full bg-brand font-display text-xs font-semibold text-surface">RM</div>
            <div className="leading-tight">
              <p className="text-[13px] font-medium">Dr. R. Menon</p>
              <p className="text-[11px] text-mute">Respiratory · Ward 4</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
