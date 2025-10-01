import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  loadSubjects,
  loadTopics,
  planWeek,
  updateProgress,
  resetTopicProgress,
  ensureProgressForStudent,
  getProgressByStudent,
} from "@/lib/storage";

function mondayOf(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  const wd = d.getDay() === 0 ? 7 : d.getDay(); // 1..7
  const monday = new Date(d.getTime() - (wd - 1) * 24 * 60 * 60 * 1000);
  return monday.toISOString().slice(0, 10);
}

export default function TopicPlanner({ sid }: { sid: string }) {
  const [subjects, setSubjects] = useState<Awaited<ReturnType<typeof loadSubjects>>>([]);
  const [topics, setTopics] = useState<Awaited<ReturnType<typeof loadTopics>>>([]);
  const [weekStart, setWeekStart] = useState(() =>
    mondayOf(new Date().toISOString().slice(0, 10)),
  );
  const [refresh, setRefresh] = useState(0);
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof planWeek>>>([]);

  useEffect(() => {
    setSubjects(loadSubjects());
    setTopics(loadTopics());
    
    const handleSubjectsUpdate = () => setSubjects(loadSubjects());
    const handleTopicsUpdate = () => setTopics(loadTopics());
    
    window.addEventListener('subjectsUpdated', handleSubjectsUpdate);
    window.addEventListener('topicsUpdated', handleTopicsUpdate);
    
    return () => {
      window.removeEventListener('subjectsUpdated', handleSubjectsUpdate);
      window.removeEventListener('topicsUpdated', handleTopicsUpdate);
    };
  }, []);

  useEffect(() => {
    ensureProgressForStudent(sid).then(() => {
      planWeek(sid, weekStart).then(setPlan);
    });
  }, [sid, weekStart, refresh]);
  const progressByTopic = useMemo(() => {
    const m = new Map<
      string,
      { completed: number; remaining: number; done?: boolean }
    >();
    for (const p of getProgressByStudent(sid))
      m.set(p.topicId, {
        completed: p.completed,
        remaining: p.remaining,
        done: p.completedFlag,
      });
    return m;
  }, [sid, refresh]);

  const planByDate = useMemo(() => {
    const m = new Map<string, typeof plan>();
    for (const p of plan) {
      const arr = m.get(p.date) || [];
      arr.push(p);
      m.set(p.date, arr);
    }
    return m;
  }, [plan]);

  const applyPlan = async () => {
    for (const p of plan) await updateProgress(sid, p.topicId, p.allocated);
    setRefresh((x) => x + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konu Bazlı Plan</CardTitle>
        <CardDescription>
          Takvim 2 — Konular, Takvim 1 ders bloklarına sırayla yerleştirilir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(mondayOf(e.target.value))}
            />
          </div>
          <Button onClick={applyPlan} disabled={plan.length === 0}>
            Planı Uygula
          </Button>
        </div>

        {/* Gün bazlı liste görünümü: Pazartesi'den Pazara */}
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" /> TYT
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-accent" /> AYT
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" /> YDT
          </span>
        </div>
        <div className="rounded-md border divide-y">
          {DAYS.map((d) => {
            const date = dateFromWeekStartLocal(weekStart, d.value);
            const entries = (planByDate.get(date) || [])
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start));
            const dayTotal = entries.reduce((sum, e) => sum + e.allocated, 0);
            const pill = (cat?: string) =>
              cat === "TYT"
                ? "bg-primary/10 border-primary/30"
                : cat === "AYT"
                  ? "bg-accent/10 border-accent/30"
                  : cat === "YDT"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-muted/40 border-muted-foreground/20";
            return (
              <div key={d.value} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {d.label} — {date}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Toplam: {dayTotal} dk
                  </div>
                </div>
                {entries.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Plan yok.</div>
                ) : (
                  <div className="grid gap-2">
                    {entries.map((p, i) => {
                      const sub = subjects.find((s) => s.id === p.subjectId);
                      const top = topics.find((t) => t.id === p.topicId);
                      const total = top?.avgMinutes || 0;
                      const pct =
                        total > 0
                          ? Math.min(
                              100,
                              Math.max(
                                0,
                                Math.round(
                                  ((total - p.remainingAfter) / total) * 100,
                                ),
                              ),
                            )
                          : 0;
                      return (
                        <div
                          key={`${p.topicId}-${i}`}
                          className={`rounded border p-2 text-sm ${pill(sub?.category)}`}
                          title={`${sub?.name}${sub?.category ? ` (${sub.category})` : ""} — ${top?.name}`}
                        >
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant="outline">
                                {p.start}–{p.end}
                              </Badge>
                              <span className="truncate">
                                {sub?.name}
                                {sub?.category
                                  ? ` (${sub.category})`
                                  : ""} — {top?.name}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {p.allocated} dk
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${pct}%` }}
                              aria-label={`Tamamlanma: ${pct}%`}
                            />
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            Kalan: {p.remainingAfter} dk
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {plan.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              Plan bulunamadı. Önce Haftalık Ders Çizelgesi ekleyin ve konuları
              yükleyin.
            </div>
          )}
        </div>

        <div className="rounded-md border p-3 space-y-2">
          <div className="text-sm font-medium">Konu Durumları</div>
          <div className="grid gap-2">
            {topics.length === 0 && (
              <div className="text-xs text-muted-foreground">Konu yok.</div>
            )}
            {topics.map((t) => {
              const sub = subjects.find((s) => s.id === t.subjectId);
              const prog = progressByTopic.get(t.id);
              if (!prog) return null;
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline">{sub?.name}</Badge>
                    <span className="truncate" title={t.name}>
                      {t.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {prog.completed}/{t.avgMinutes} dk
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetTopicProgress(sid, t.id);
                        setRefresh((x) => x + 1);
                      }}
                    >
                      Sıfırla
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Helpers & grid component for weekly topic visualization ---
const DAYS: { value: 1 | 2 | 3 | 4 | 5 | 6 | 7; label: string }[] = [
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Salı" },
  { value: 3, label: "Çarşamba" },
  { value: 4, label: "Perşembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
  { value: 7, label: "Pazar" },
];
const START_MIN = 7 * 60; // 07:00
const END_MIN = 24 * 60; // 24:00
const STEP = 30; // 30dk
const ROWS = (END_MIN - START_MIN) / STEP; // 34 satır
const ROW_H = 28; // px

function toMinHHmm(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function fmtHHmm(mins: number) {
  const m = Math.max(0, Math.min(mins, END_MIN - 1));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function dateFromWeekStartLocal(
  weekStartISO: string,
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7,
) {
  const d = new Date(weekStartISO + "T00:00:00");
  const result = new Date(d.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
  return result.toISOString().slice(0, 10);
}

function WeeklyTopicGrid({
  plan,
  weekStart,
  subjects,
  topics,
}: {
  plan: Awaited<ReturnType<typeof planWeek>>;
  weekStart: string;
  subjects: Awaited<ReturnType<typeof loadSubjects>>;
  topics: Awaited<ReturnType<typeof loadTopics>>;
}) {
  const planByDate = useMemo(() => {
    const m = new Map<string, typeof plan>();
    for (const p of plan) {
      const arr = m.get(p.date) || [];
      arr.push(p);
      m.set(p.date, arr);
    }
    return m;
  }, [plan]);

  return (
    <div className="w-full overflow-auto rounded border">
      {/* Header */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `100px repeat(7, minmax(180px, 1fr))` }}
      >
        <div className="p-2 text-xs text-muted-foreground border-b bg-muted/40">
          Saat
        </div>
        {DAYS.map((d) => (
          <div
            key={d.value}
            className="p-2 text-xs font-medium border-b bg-muted/40"
          >
            {d.label}
          </div>
        ))}
      </div>
      {/* Body */}
      <div className="relative">
        <div
          className="grid"
          style={{ gridTemplateColumns: `100px repeat(7, minmax(180px, 1fr))` }}
        >
          {/* Time labels */}
          <div className="relative">
            {[...Array(ROWS + 1)].map((_, i) => {
              const m = START_MIN + i * STEP;
              const isHour = m % 60 === 0;
              return (
                <div key={i} style={{ height: ROW_H }} className="relative">
                  {isHour && (
                    <div className="absolute -translate-y-1/2 top-1/2 right-2 text-[11px] text-muted-foreground">
                      {fmtHHmm(m)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Day columns */}
          {DAYS.map((d) => {
            const date = dateFromWeekStartLocal(weekStart, d.value);
            const entries = (planByDate.get(date) || [])
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start));
            return (
              <div key={d.value} className="relative">
                {[...Array(ROWS)].map((_, ri) => (
                  <div
                    key={ri}
                    style={{ height: ROW_H }}
                    className="border-t border-l last:border-r"
                  />
                ))}
                {/* Render planned topic blocks */}
                <div className="absolute inset-0 pointer-events-none">
                  {entries.map((p, idx) => {
                    const top =
                      ((toMinHHmm(p.start) - START_MIN) / STEP) * ROW_H;
                    const height =
                      ((toMinHHmm(p.end) - toMinHHmm(p.start)) / STEP) * ROW_H;
                    const sub = subjects.find((s) => s.id === p.subjectId);
                    const topc = topics.find((t) => t.id === p.topicId);
                    return (
                      <div
                        key={idx}
                        style={{ top, height }}
                        className="absolute left-2 right-2 rounded bg-accent/20 border border-accent/40 text-xs p-2 flex items-center justify-between gap-2 backdrop-blur"
                        title={`${sub?.name}${sub?.category ? ` (${sub.category})` : ""} — ${topc?.name} (${p.start}-${p.end})`}
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {sub?.name}
                            {sub?.category ? ` (${sub.category})` : ""}
                          </div>
                          <div
                            className="text-[11px] text-muted-foreground truncate"
                            title={topc?.name}
                          >
                            {topc?.name}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.start} – {p.end}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {plan.length === 0 && (
        <div className="p-3 text-sm text-muted-foreground">
          Plan bulunamadı. Önce Haftalık Ders Çizelgesi ekleyin ve konuları
          yükleyin.
        </div>
      )}
    </div>
  );
}
