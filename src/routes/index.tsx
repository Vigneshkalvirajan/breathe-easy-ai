import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { Sidebar } from "@/components/console/sidebar";
import { Spectrogram, Waveform } from "@/components/console/waveform";
import {
  analysis,
  pastRecordings,
  patient,
  severityBar,
  severityDot,
  severityLabel,
  severityText,
} from "@/lib/console-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Auscio Triage Console — Respiratory Diagnosis from Stethoscope Audio" },
      {
        name: "description",
        content:
          "Upload a stethoscope recording, review AI wheeze and crackle detection, notify the patient by SMS and generate a clinical report.",
      },
      { property: "og:title", content: "Auscio Triage Console" },
      {
        property: "og:description",
        content:
          "Respiratory diagnosis from stethoscope audio with SMS patient notification and clinical reporting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Console,
});

type Step = "upload" | "analyze" | "notify" | "report";

function Console() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("bell_leftmid_18mar.wav");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("done");
  const [smsState, setSmsState] = useState<"idle" | "sending" | "sent">("idle");
  const [tab, setTab] = useState<"analyzed" | "recording" | "report">("analyzed");

  const step: Step =
    status !== "done" ? "analyze" : smsState === "sent" ? "report" : "notify";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setSmsState("idle");
    setStatus("analyzing");
    setTimeout(() => setStatus("done"), 2200);
  }

  function sendSms() {
    setSmsState("sending");
    setTimeout(() => setSmsState("sent"), 1400);
  }

  const stepIndex: Record<Step, number> = { upload: 1, analyze: 2, notify: 3, report: 4 };
  const steps: { n: number; label: string }[] = [
    { n: 1, label: "Upload" },
    { n: 2, label: "Analyze" },
    { n: 3, label: "Notify" },
    { n: 4, label: "Report" },
  ];

  return (
    <div className="flex min-h-screen bg-paper font-body text-ink antialiased">
      <Sidebar active="console" />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-surface/80 px-6 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-[11px] text-mute">{analysis.caseId}</span>
            <span className="size-1 rounded-full bg-line" />
            <span className="truncate text-sm font-medium">
              {patient.name} · {patient.age}
              {patient.sex} · Asthma review
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md bg-line/40 p-0.5 text-xs font-medium">
              {(["analyzed", "recording", "report"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`cursor-pointer rounded px-2.5 py-1 capitalize ${
                    tab === t ? "bg-surface text-ink" : "text-mute"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-soft/40"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M8 7l4-4 4 4M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
              </svg>
              Upload audio
            </button>
            <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />
          </div>
        </header>

        <div className="px-6 pt-6">
          <div className="flex items-center gap-2 font-mono text-xs">
            {steps.map((s, i) => (
              <span key={s.n} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-5 bg-line" />}
                <span className="flex items-center gap-1.5">
                  <span
                    className={`grid size-4 place-items-center rounded-full text-[9px] ${
                      s.n < stepIndex[step]
                        ? "bg-brand text-surface"
                        : s.n === stepIndex[step]
                          ? "bg-sev-mid text-surface"
                          : "bg-line text-mute"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={
                      s.n < stepIndex[step]
                        ? "font-medium text-ink"
                        : s.n === stepIndex[step]
                          ? "font-medium text-sev-mid"
                          : "text-mute"
                    }
                  >
                    {s.label}
                  </span>
                </span>
              </span>
            ))}
            <span className="ml-auto text-mute">Lung · {analysis.site}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-5">
            <section className="rounded-xl bg-surface p-5 ring-1 ring-black/5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="max-w-[20ch] text-balance font-display text-2xl font-semibold leading-tight">
                    {status === "analyzing" ? "Analyzing breath cycles…" : analysis.finding}
                  </h1>
                  <p className="mt-1 max-w-[52ch] text-pretty text-sm text-mute">
                    {status === "analyzing"
                      ? `Processing ${fileName} across three breath cycles.`
                      : analysis.summary}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sev-mid/12 px-2.5 py-1 text-xs font-medium text-sev-mid ring-1 ring-sev-mid/20">
                  <span className="size-1.5 rounded-full bg-sev-mid" />
                  {severityLabel[analysis.severity]}
                </span>
              </div>

              <div className="rounded-lg bg-ink/95 p-4 outline-1 -outline-offset-1 outline-black/5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-surface/50">
                    Auscultation · {fileName}
                  </span>
                  <span className="font-mono text-[10px] text-surface/50">
                    Lung · 1.2 kHz · {analysis.sampleRate}
                  </span>
                </div>
                <Waveform playhead={status === "analyzing" ? 30 : 64} />
              </div>

              <div className="mt-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                  Model confidence · v3.2
                </p>
                <div className="space-y-2.5">
                  {analysis.predictions.map((p, i) => (
                    <div key={p.label} className="flex items-center gap-3">
                      <span className={`w-24 shrink-0 text-sm ${i === 0 ? "font-medium" : "text-mute"}`}>
                        {p.label}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
                        <div
                          className={`conf-bar h-full rounded-full ${severityBar[p.severity]}`}
                          style={{
                            width: status === "analyzing" ? "0%" : `${p.confidence}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      </div>
                      <span className={`w-10 text-right font-mono text-xs ${i === 0 ? "text-ink" : "text-mute"}`}>
                        {status === "analyzing" ? "—" : `${p.confidence}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <section className="rounded-xl bg-surface p-5 ring-1 ring-black/5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium">Spectrogram</h2>
                  <span className="font-mono text-[10px] text-mute">0–4 kHz</span>
                </div>
                <div className="rounded-lg bg-ink/95 p-3 outline-1 -outline-offset-1 outline-black/5">
                  <Spectrogram />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-paper py-2">
                    <p className="font-mono text-sm text-ink">{analysis.peakHz}</p>
                    <p className="text-[10px] uppercase tracking-wider text-mute">Peak Hz</p>
                  </div>
                  <div className="rounded-md bg-paper py-2">
                    <p className="font-mono text-sm text-ink">{analysis.duration}</p>
                    <p className="text-[10px] uppercase tracking-wider text-mute">Duration</p>
                  </div>
                  <div className="rounded-md bg-paper py-2">
                    <p className="font-mono text-sm text-ink">{analysis.sampleRate}</p>
                    <p className="text-[10px] uppercase tracking-wider text-mute">Sample</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-surface p-5 ring-1 ring-black/5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium">Past recordings</h2>
                  <span className="font-mono text-[10px] text-mute">08 total</span>
                </div>
                <div className="space-y-1">
                  {pastRecordings.map((r) => (
                    <button
                      key={r.label}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-paper"
                    >
                      <span className={`size-1.5 shrink-0 rounded-full ${severityDot[r.severity]}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px]">{r.label}</span>
                        <span className="block font-mono text-[10px] text-mute">{r.when}</span>
                      </span>
                      <span className="font-mono text-[11px] text-mute">{r.confidence}%</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-xl bg-surface p-5 ring-1 ring-black/5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-brand font-display text-sm font-semibold text-surface">
                  {patient.initials}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{patient.name}</p>
                  <p className="font-mono text-[11px] text-mute">
                    MRN {patient.mrn} · {patient.age}
                    {patient.sex}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-mute">Site</span>
                  <span className="font-medium">{analysis.site}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Phone</span>
                  <span className="font-mono text-[13px]">{patient.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Last visit</span>
                  <span className="font-medium">{patient.lastVisit}</span>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-paper p-3 ring-1 ring-line">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">SMS preview</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/80">
                  Auscio: Your lung sound review shows {analysis.finding.toLowerCase()} (moderate).
                  {" "}
                  {analysis.recommendation} Please contact Ward 4 to book a follow-up.
                </p>
              </div>

              <button
                onClick={sendSms}
                disabled={smsState !== "idle"}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-surface ring-1 ring-brand disabled:opacity-60"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                </svg>
                {smsState === "idle" ? "Send SMS to patient" : smsState === "sending" ? "Sending…" : "SMS sent"}
              </button>

              {smsState === "sent" && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-sev-low/10 px-3 py-2 text-xs">
                  <svg className="size-4 shrink-0 text-sev-low" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-ink/80">Delivered · just now</span>
                  <span className="ml-auto font-mono text-[10px] text-mute">1 of 1</span>
                </div>
              )}
            </section>

            <section className="rounded-xl bg-surface p-5 ring-1 ring-black/5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Clinical report</h2>
                <span className="font-mono text-[10px] text-mute">Draft</span>
              </div>
              <div className="rounded-lg bg-paper p-4 ring-1 ring-line">
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <div className="grid size-6 place-items-center rounded bg-brand font-display text-[10px] font-semibold text-surface">A</div>
                  <div className="leading-tight">
                    <p className="text-xs font-medium">Auscio Auscultation Report</p>
                    <p className="font-mono text-[10px] text-mute">{analysis.caseId} · 18 Mar</p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-mute">Finding</span>
                    <span className="max-w-[14ch] text-right font-medium">{analysis.finding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">Severity</span>
                    <span className={`font-medium ${severityText[analysis.severity]}`}>
                      {severityLabel[analysis.severity]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">Confidence</span>
                    <span className="font-mono">{analysis.predictions[0]?.confidence ?? 0}%</span>
                  </div>
                  <p className="text-pretty pt-1 text-mute">{analysis.recommendation}</p>
                </div>
              </div>
              <button
                onClick={() => navigate({ to: "/report" })}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-brand bg-surface px-4 py-2.5 text-sm font-medium text-brand"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12M8 11l4 4 4-4M5 21h14" />
                </svg>
                Generate report
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
