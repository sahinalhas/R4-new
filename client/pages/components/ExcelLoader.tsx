import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  addSubject,
  addTopic,
  loadSubjects,
  loadTopics,
  StudySubject,
  StudyTopic,
} from "@/lib/storage";

function parseSubjectHeader(raw: string): {
  name: string;
  category?: StudySubject["category"];
} {
  const m = raw.match(/^(.*)\s*\((TYT|AYT|YDT|YKS|LGS)\)\s*$/i);
  if (m) {
    const name = m[1].trim();
    const cat = m[2].toUpperCase() as any;
    return { name, category: cat };
  }
  return { name: raw.trim() };
}

export default function ExcelLoader() {
  const [refresh, setRefresh] = useState(0);
  const subjects = useMemo(() => loadSubjects(), [refresh]);
  const topics = useMemo(() => loadTopics(), [refresh]);

  const onFile = async (file: File) => {
    const { read, utils } = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });
    if (!rows || rows.length === 0) return;
    const header = rows[0];
    const maxCols = header.length;
    for (let c = 0; c < maxCols; c += 2) {
      const hdr = header[c];
      if (!hdr) continue;
      const { name, category } = parseSubjectHeader(String(hdr));
      let subject = subjects.find(
        (s) => s.name === name && s.category === category,
      );
      if (!subject) {
        subject = { id: crypto.randomUUID(), name, category };
        addSubject(subject);
      }
      let order = 1;
      for (let r = 1; r < rows.length; r++) {
        const topicName = rows[r][c];
        const minVal = rows[r][c + 1];
        if (!topicName && !minVal) continue;
        const nm = String(topicName || "").trim();
        if (!nm) continue;
        const minutes = Number(minVal || 0) || 0;
        const exists = topics.find(
          (t) => t.subjectId === subject!.id && t.name === nm,
        );
        if (exists) {
          const { updateTopic } = await import("@/lib/storage");
          updateTopic(exists.id, { avgMinutes: minutes, order });
        } else {
          const t: StudyTopic = {
            id: crypto.randomUUID(),
            subjectId: subject.id,
            name: nm,
            avgMinutes: minutes,
            order,
          };
          addTopic(t);
        }
        order += 1;
      }
    }
    setRefresh((x) => x + 1);
  };

  const seedExamples = () => {
    const ensure = (nm: string, cat?: StudySubject["category"]) => {
      let s = loadSubjects().find((x) => x.name === nm && x.category === cat);
      if (!s) {
        s = { id: crypto.randomUUID(), name: nm, category: cat };
        addSubject(s);
      }
      return s;
    };
    const m = ensure("Matematik", "TYT");
    const f = ensure("Fizik", "AYT");
    const addT = (
      s: StudySubject,
      name: string,
      min: number,
      order: number,
    ) => {
      const exists = loadTopics().find(
        (t) => t.subjectId === s.id && t.name === name,
      );
      if (!exists)
        addTopic({
          id: crypto.randomUUID(),
          subjectId: s.id,
          name,
          avgMinutes: min,
          order,
        });
    };
    addT(m, "Sayılar", 60, 1);
    addT(m, "Problemler", 540, 2);
    addT(f, "Elektrik", 120, 1);
    addT(f, "Manyetizma", 90, 2);
    setRefresh((x) => x + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YKS Ders ve Konuları Yükle</CardTitle>
        <CardDescription>
          Excel ile iki sütunlu gruplar halinde (A/B, C/D, ...) içe aktarın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="block">
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={(e) => e.target.files && onFile(e.target.files[0])}
          />
          <Button variant="secondary" className="w-full">
            Excel Yükle
          </Button>
        </label>
        <Button variant="outline" onClick={seedExamples}>
          Örnek Verileri Yükle
        </Button>
        <div className="text-xs text-muted-foreground">
          Mevcut ders sayısı: {subjects.length} • Konu sayısı: {topics.length}
        </div>
      </CardContent>
    </Card>
  );
}
