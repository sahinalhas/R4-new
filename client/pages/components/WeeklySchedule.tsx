import { useMemo, useState, useRef, useEffect } from "react";
import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  loadSubjects,
  getWeeklySlotsByStudent,
  addWeeklySlot,
  removeWeeklySlot,
  updateWeeklySlot,
  WeeklySlot,
  weeklyTotalMinutes,
} from "@/lib/storage";

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

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function fmt(mins: number) {
  const m = Math.max(0, Math.min(mins, END_MIN - 1));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function overlaps(a: WeeklySlot, b: WeeklySlot) {
  if (a.day !== b.day) return false;
  const s1 = toMin(a.start),
    e1 = toMin(a.end);
  const s2 = toMin(b.start),
    e2 = toMin(b.end);
  return Math.max(s1, s2) < Math.min(e1, e2);
}

export default function WeeklySchedule({ sid }: { sid: string }) {
  const [subjects, setSubjects] = useState<Awaited<ReturnType<typeof loadSubjects>>>([]);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"LGS" | "YKS" | "TYT" | "AYT" | "YDT" | "Tümü">("Tümü");
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSubjects(loadSubjects());
    
    const handleUpdate = () => setSubjects(loadSubjects());
    window.addEventListener('subjectsUpdated', handleUpdate);
    return () => window.removeEventListener('subjectsUpdated', handleUpdate);
  }, []);

  const slots = useMemo(
    () =>
      getWeeklySlotsByStudent(sid)
        .slice()
        .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start)),
    [sid, refresh],
  );

  const totalMin = weeklyTotalMinutes(sid);
  const warnLow = totalMin < 5 * 60;
  const warnHigh = totalMin > 10 * 60;

  const filteredSubjects = useMemo(() => {
    if (selectedCategory === "Tümü") {
      return subjects;
    }
    return subjects.filter((s) => s.category === selectedCategory);
  }, [subjects, selectedCategory]);

  const onDragStart = (e: React.DragEvent, subjectId: string) => {
    e.dataTransfer.setData("text/plain", subjectId);
    e.dataTransfer.effectAllowed = "copy";
    (window as any)._dragSubjectId = subjectId;
  };

  const dropOn = (day: 1 | 2 | 3 | 4 | 5 | 6 | 7, startMin: number) => {
    setError("");
    const moving = (window as any)._dragSlotMove as
      | { id: string; duration: number }
      | undefined;

    if (moving) {
      const existing = slots.find((s) => s.id === moving.id);
      if (!existing) return;
      const duration = Math.max(
        STEP,
        Math.round(moving.duration / STEP) * STEP,
      );
      let start = Math.max(START_MIN, Math.min(startMin, END_MIN - STEP));
      let end = Math.min(start + duration, END_MIN);
      if (end - start < duration)
        start = Math.max(START_MIN, END_MIN - duration);
      const candidate: WeeklySlot = {
        ...existing,
        day,
        start: fmt(start),
        end: fmt(end),
      };
      for (const s of slots) {
        if (s.id !== existing.id && overlaps(s, candidate)) {
          setError("Bu saatte başka bir ders var!");
          return;
        }
      }
      updateWeeklySlot(existing.id, {
        day,
        start: candidate.start,
        end: candidate.end,
      });
      (window as any)._dragSlotMove = undefined;
      setRefresh((x) => x + 1);
      return;
    }

    const subjectId = (window as any)._dragSubjectId as string | undefined;
    const chosen = subjectId && subjects.find((s) => s.id === subjectId);
    if (!chosen) {
      setError("Lütfen bir dersi sürükleyin");
      return;
    }
    const start = Math.max(START_MIN, Math.min(startMin, END_MIN - STEP));
    const defaultDur = 60; // dk
    const end = Math.min(start + defaultDur, END_MIN);
    const w: WeeklySlot = {
      id: crypto.randomUUID(),
      studentId: sid,
      day,
      start: fmt(start),
      end: fmt(end),
      subjectId: chosen.id,
    };
    for (const s of slots) {
      if (overlaps(s, w)) {
        setError("Bu saatte başka bir ders var!");
        return;
      }
    }
    addWeeklySlot(w);
    setRefresh((x) => x + 1);
  };

  const onCellDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer.getData("text/plain");
    if (dt && !dt.startsWith("move-slot:")) (window as any)._dragSubjectId = dt;
  };

  const resizingRef = useRef<null | {
    id: string;
    edge: "top" | "bottom";
    startY: number;
    origStart: number;
    origEnd: number;
    day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    minStart: number; // lower bound for start when resizing top
    maxEnd: number; // upper bound for end when resizing bottom
  }>(null);
  const appliedRef = useRef<{ id: string; start: number; end: number } | null>(
    null,
  );

  const onPointerMove = (ev: PointerEvent) => {
    const st = resizingRef.current;
    if (!st) return;
    const dy = ev.clientY - st.startY;
    const deltaRows = Math.round(dy / ROW_H);

    if (st.edge === "top") {
      let newStart = st.origStart + deltaRows * STEP;
      newStart = Math.max(st.minStart, Math.min(newStart, st.origEnd - STEP));
      if (!appliedRef.current)
        appliedRef.current = {
          id: st.id,
          start: st.origStart,
          end: st.origEnd,
        };
      if (appliedRef.current.start !== newStart) {
        updateWeeklySlot(st.id, { start: fmt(newStart) });
        appliedRef.current.start = newStart;
        setRefresh((x) => x + 1);
      }
    } else {
      let newEnd = st.origEnd + deltaRows * STEP;
      newEnd = Math.min(st.maxEnd, Math.max(newEnd, st.origStart + STEP));
      if (!appliedRef.current)
        appliedRef.current = {
          id: st.id,
          start: st.origStart,
          end: st.origEnd,
        };
      if (appliedRef.current.end !== newEnd) {
        updateWeeklySlot(st.id, { end: fmt(newEnd) });
        appliedRef.current.end = newEnd;
        setRefresh((x) => x + 1);
      }
    }
  };
  const onPointerUp = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    resizingRef.current = null;
    appliedRef.current = null;
  };
  const startResize = (
    slot: WeeklySlot,
    edge: "top" | "bottom",
    e: React.PointerEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const origStart = toMin(slot.start);
    const origEnd = toMin(slot.end);
    let minStart = START_MIN;
    let maxEnd = END_MIN;
    const sameDayOthers = slots.filter(
      (x) => x.day === slot.day && x.id !== slot.id,
    );
    for (const o of sameDayOthers) {
      const oEnd = toMin(o.end);
      if (oEnd <= origStart && oEnd > minStart) minStart = oEnd;
    }
    for (const o of sameDayOthers) {
      const oStart = toMin(o.start);
      if (oStart >= origEnd && oStart < maxEnd) maxEnd = oStart;
    }
    resizingRef.current = {
      id: slot.id,
      edge,
      startY: e.clientY,
      origStart,
      origEnd,
      day: slot.day,
      minStart,
      maxEnd,
    };
    appliedRef.current = { id: slot.id, start: origStart, end: origEnd };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haftalık Ders Çizelgesi</CardTitle>
        <CardDescription>
          Takvim 1 — Üstten dersi sürükleyip gün/saat alanına bırakın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === "Tümü" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Tümü")}
            >
              Tümü
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "LGS" ? "default" : "outline"}
              onClick={() => setSelectedCategory("LGS")}
            >
              LGS
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "TYT" ? "default" : "outline"}
              onClick={() => setSelectedCategory("TYT")}
            >
              TYT
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "AYT" ? "default" : "outline"}
              onClick={() => setSelectedCategory("AYT")}
            >
              AYT
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "YDT" ? "default" : "outline"}
              onClick={() => setSelectedCategory("YDT")}
            >
              YDT
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Önce dersleri yükleyin.
              </div>
            )}
            {filteredSubjects.length === 0 && subjects.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Bu kategoride ders bulunamadı.
              </div>
            )}
            {filteredSubjects.map((s) => (
              <Badge
                key={s.id}
                variant="secondary"
                draggable
                onDragStart={(e) => onDragStart(e, s.id)}
                className="cursor-grab select-none"
                title={`${s.name}${s.category ? ` (${s.category})` : ""} — sürükleyin`}
              >
                {s.name}
                {s.category ? ` (${s.category})` : ""}
              </Badge>
            ))}
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div ref={calendarRef} className="w-full overflow-auto rounded border">
          {/* Header */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `72px repeat(7, minmax(60px, 1fr))`,
            }}
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
              style={{
                gridTemplateColumns: `72px repeat(7, minmax(60px, 1fr))`,
              }}
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
                          {fmt(m)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Day columns with drop zones */}
              {DAYS.map((d) => (
                <div key={d.value} className="relative">
                  {[...Array(ROWS)].map((_, ri) => {
                    const m = START_MIN + ri * STEP;
                    return (
                      <div
                        key={ri}
                        onDragOver={(e) => onCellDragOver(e)}
                        onDrop={(e) => {
                          const dt = e.dataTransfer.getData("text/plain");
                          if (dt?.startsWith("move-slot:")) {
                            const id = dt.slice(10);
                            const sl = slots.find((x) => x.id === id);
                            if (sl) {
                              (window as any)._dragSlotMove = {
                                id,
                                duration: Math.max(
                                  0,
                                  toMin(sl.end) - toMin(sl.start),
                                ),
                              };
                            }
                          } else if (dt) {
                            (window as any)._dragSubjectId = dt;
                          }
                          dropOn(d.value, m);
                        }}
                        style={{ height: ROW_H }}
                        className="border-t border-l last:border-r hover:bg-muted/30 transition-colors"
                      />
                    );
                  })}

                  {/* Render slots for this day as absolute blocks */}
                  <div className="absolute inset-0 pointer-events-none">
                    {slots
                      .filter((s) => s.day === d.value)
                      .map((s) => {
                        const top =
                          ((toMin(s.start) - START_MIN) / STEP) * ROW_H;
                        const height =
                          (Math.max(0, toMin(s.end) - toMin(s.start)) / STEP) *
                          ROW_H;
                        const subj = subjects.find((x) => x.id === s.subjectId);
                        return (
                          <div
                            key={s.id}
                            style={{ top, height }}
                            className="absolute left-2 right-2 rounded bg-primary/15 border border-primary/30 text-xs p-2 pr-8 flex items-center gap-2 backdrop-blur pointer-events-auto cursor-move"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData(
                                "text/plain",
                                `move-slot:${s.id}`,
                              );
                            }}
                            onDragEnd={() => {
                              (window as any)._dragSlotMove = undefined;
                            }}
                          >
                            {/* Resize handles */}
                            <div
                              className="absolute left-0 right-0 h-2 top-0"
                              style={{ cursor: "n-resize" }}
                              data-role="resize-top"
                              onPointerDown={(e) => startResize(s, "top", e)}
                              title="Üstten sürükleyerek kısalt/uzat (30dk)"
                            />
                            <div
                              className="absolute left-0 right-0 h-2 bottom-0"
                              style={{ cursor: "s-resize" }}
                              data-role="resize-bottom"
                              onPointerDown={(e) => startResize(s, "bottom", e)}
                              title="Alttan sürükleyerek kısalt/uzat (30dk)"
                            />

                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {subj?.name}
                                {subj?.category ? ` (${subj.category})` : ""}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {s.start} – {s.end}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="outline"
                              aria-label="Kaldır"
                              title="Kaldır"
                              className="absolute top-1 right-1 h-7 w-7 p-0"
                              onClick={() => {
                                removeWeeklySlot(s.id);
                                setRefresh((x) => x + 1);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm">
          Haftalık toplam:{" "}
          <span className="font-medium">
            {Math.round((totalMin / 60) * 10) / 10} saat
          </span>
          {warnLow && (
            <span className="ml-2 text-amber-600">
              Çalışma süren çok düşük!
            </span>
          )}
          {warnHigh && (
            <span className="ml-2 text-red-600">Plan çok yoğun!</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
