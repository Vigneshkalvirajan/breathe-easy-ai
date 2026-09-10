import { createFileRoute, Link } from "@tanstack/react-router";

import { Sidebar } from "@/components/console/sidebar";
import {
  analysis,
  patient,
  severityBar,
  severityLabel,
  severityText,
} from "@/lib/console-data";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Clinical Report — Auscio Respiratory Assessment" },
      {
        name: "description",
        content:
          "Printable respiratory auscultation report with finding, severity, model confidence and clinical recommendation.",
      },
      { property: "og:title", content: "Auscio Clinical Report" },
      {
        property: "og:description",
        content: "Printable respiratory auscultation report generated from stethoscope audio.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <div className="flex min-h-screen bg-paper font-body text-ink antialiased">
      <div className="no-print">
        <Sidebar active="reports" />
      </div>

      <div className="min-w-0 flex-1">
        <header className="no-print flex items-center justify-between gap-4 border-b border-line bg-surface/80 px-6 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-[11px] text-mute">{analysis.caseId}</span>
            <span className="size-1 rounded-full bg-line" />
            <span className="truncate text-sm font-medium">Report · {patient.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-soft/40"
            >
              Back to console
            </Link>
            <button
              onClick={() => window.print()}
              className="flex cursor-pointer items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-surface"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z" />
              </svg>
              Download PDF
            </button>
          </div>
        </header>

        <div className="p-6">
          <article className="mx-auto max-w-3xl rounded-xl bg-surface p-8 ring-1 ring-black/5">
            <div className="flex items-start justify-between border-b border-line pb-5">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-md bg-brand font-display text-sm font-semibold text-surface">A</div>
                <div className="leading-tight">
                  <h1 className="font-display text-lg font-semibold">Auscio Auscultation Report</h1>
                  <p className="font-mono text-[11px] text-mute">
                    {analysis.caseId} · 18 Mar 2025 · Ward 4
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${severityText[analysis.severity]}`}>
                {severityLabel[analysis.severity]}
              </span>
            </div>

            <section className="grid grid-cols-2 gap-x-8 gap-y-3 py-5 text-sm">
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">Patient</span>
                <span className="font-medium">{patient.name}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">MRN</span>
                <span className="font-mono text-[13px]">{patient.mrn}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">Age / Sex</span>
                <span className="font-medium">
                  {patient.age} · {patient.sex}
                </span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">Auscultation site</span>
                <span className="font-medium">{analysis.site}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">Clinician</span>
                <span className="font-medium">Dr. R. Menon</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-mute">Recording</span>
                <span className="font-mono text-[13px]">
                  {analysis.duration} · {analysis.sampleRate}
                </span>
              </div>
            </section>

            <section className="py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Finding</p>
              <p className="mt-1 font-display text-xl font-semibold">{analysis.finding}</p>
              <p className="mt-2 max-w-[62ch] text-pretty text-sm text-mute">{analysis.summary}</p>
            </section>

            <section className="py-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                Model confidence · v3.2
              </p>
              <div className="space-y-2.5">
                {analysis.predictions.map((p) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-sm text-mute">{p.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
                      <div
                        className={`h-full rounded-full ${severityBar[p.severity]}`}
                        style={{ width: `${p.confidence}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs">{p.confidence}%</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-2 rounded-lg bg-paper p-4 ring-1 ring-line">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                Recommendation
              </p>
              <p className="mt-1.5 text-sm">{analysis.recommendation}</p>
            </section>

            <section className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-mute">
              <span>Patient notified by SMS to {patient.phone}</span>
              <span className="font-mono">Signed · Dr. R. Menon</span>
            </section>

            <p className="mt-4 text-[11px] leading-relaxed text-mute">
              Decision support only. Findings are model-generated from a single auscultation
              recording and must be confirmed by a qualified clinician.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
