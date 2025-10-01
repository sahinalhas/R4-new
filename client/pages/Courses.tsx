import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  StudySubject,
  StudyTopic,
  addSubject,
  addTopic,
  loadSubjects,
  loadTopics,
  loadSubjectsAsync,
  loadTopicsAsync,
  updateSubject,
  removeSubject,
  removeTopicsBySubject,
  updateTopic,
  removeTopic,
  getTopicsBySubject,
} from "@/lib/storage";

type Cat = "okul" | "TYT" | "AYT" | "YDT" | "LGS";

export default function Courses() {
  const { toast } = useToast();
  const [cat, setCat] = useState<Cat>("okul");
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [topicName, setTopicName] = useState("");
  const [topicMinutes, setTopicMinutes] = useState<string>("");

  useEffect(() => {
    refreshAll();
     
  }, []);

  async function refreshAll() {
    const [subjectsData, topicsData] = await Promise.all([
      loadSubjectsAsync(),
      loadTopicsAsync()
    ]);
    setSubjects(subjectsData);
    setTopics(topicsData);
  }

  useEffect(() => {
    if (!selectedSubjectId) return;
    const inList = filteredSubjects.some((s) => s.id === selectedSubjectId);
    if (!inList) setSelectedSubjectId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, subjects]);

  const filteredSubjects = useMemo(() => {
    if (cat === "okul") return subjects.filter((s) => !s.category);
    return subjects.filter((s) => s.category === cat);
  }, [subjects, cat]);

  const currentSubject = useMemo(
    () => filteredSubjects.find((s) => s.id === selectedSubjectId),
    [filteredSubjects, selectedSubjectId],
  );

  const currentTopics = useMemo(
    () => topics.filter((t) => t.subjectId === selectedSubjectId),
    [topics, selectedSubjectId],
  );

  async function onAddSubject() {
    const name = newSubject.trim();
    if (!name) {
      toast({ title: "Ders adı gerekli", variant: "destructive" });
      return;
    }
    const exists = subjects.some(
      (s) =>
        (cat === "okul" ? !s.category : s.category === cat) &&
        s.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      toast({ title: "Bu ders zaten mevcut", variant: "destructive" });
      return;
    }
    const payload: StudySubject = {
      id: crypto.randomUUID(),
      name,
      category: cat === "okul" ? undefined : cat,
    };
    await addSubject(payload);
    await refreshAll();
    setNewSubject("");
    toast({ title: "Ders eklendi", description: subjectLabel(payload) });
  }

  async function onAddTopic() {
    if (!selectedSubjectId) {
      toast({ title: "Önce ders seçin", variant: "destructive" });
      return;
    }
    const name = topicName.trim();
    if (!name) {
      toast({ title: "Konu adı gerekli", variant: "destructive" });
      return;
    }
    const minutes = Number(topicMinutes || 0) || 0;
    const t: StudyTopic = {
      id: crypto.randomUUID(),
      subjectId: selectedSubjectId,
      name,
      avgMinutes: minutes,
    };
    await addTopic(t);
    await refreshAll();
    setTopicName("");
    setTopicMinutes("");
    toast({ title: "Konu eklendi", description: `${name} • ${minutes} dk` });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dersler & Konular</h1>
        <p className="text-sm text-muted-foreground">
          Kategori seçin, ders ekleyin; ders altında konu ve tahmini süre girin.
        </p>
      </div>

      <Tabs value={cat} onValueChange={(v) => setCat(v as Cat)}>
        <TabsList>
          <TabsTrigger value="okul">Okul Dersleri</TabsTrigger>
          <TabsTrigger value="TYT">TYT Dersleri</TabsTrigger>
          <TabsTrigger value="AYT">AYT Dersleri</TabsTrigger>
          <TabsTrigger value="YDT">YDT Dersleri</TabsTrigger>
          <TabsTrigger value="LGS">LGS Dersleri</TabsTrigger>
        </TabsList>

        <TabsContent value="okul">
          <CategoryPanel
            subjects={filteredSubjects}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            onAddSubject={onAddSubject}
            currentSubjectName={currentSubject?.name}
            topics={currentTopics}
            topicName={topicName}
            setTopicName={setTopicName}
            topicMinutes={topicMinutes}
            setTopicMinutes={setTopicMinutes}
            onAddTopic={onAddTopic}
            onRefresh={refreshAll}
          />
        </TabsContent>

        <TabsContent value="TYT">
          <CategoryPanel
            subjects={filteredSubjects}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            onAddSubject={onAddSubject}
            currentSubjectName={currentSubject?.name}
            topics={currentTopics}
            topicName={topicName}
            setTopicName={setTopicName}
            topicMinutes={topicMinutes}
            setTopicMinutes={setTopicMinutes}
            onAddTopic={onAddTopic}
            onRefresh={refreshAll}
          />
        </TabsContent>

        <TabsContent value="AYT">
          <CategoryPanel
            subjects={filteredSubjects}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            onAddSubject={onAddSubject}
            currentSubjectName={currentSubject?.name}
            topics={currentTopics}
            topicName={topicName}
            setTopicName={setTopicName}
            topicMinutes={topicMinutes}
            setTopicMinutes={setTopicMinutes}
            onAddTopic={onAddTopic}
            onRefresh={refreshAll}
          />
        </TabsContent>

        <TabsContent value="YDT">
          <CategoryPanel
            subjects={filteredSubjects}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            onAddSubject={onAddSubject}
            currentSubjectName={currentSubject?.name}
            topics={currentTopics}
            topicName={topicName}
            setTopicName={setTopicName}
            topicMinutes={topicMinutes}
            setTopicMinutes={setTopicMinutes}
            onAddTopic={onAddTopic}
            onRefresh={refreshAll}
          />
        </TabsContent>

        <TabsContent value="LGS">
          <CategoryPanel
            subjects={filteredSubjects}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            onAddSubject={onAddSubject}
            currentSubjectName={currentSubject?.name}
            topics={currentTopics}
            topicName={topicName}
            setTopicName={setTopicName}
            topicMinutes={topicMinutes}
            setTopicMinutes={setTopicMinutes}
            onAddTopic={onAddTopic}
            onRefresh={refreshAll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function subjectLabel(s: StudySubject) {
  if (!s.category) return s.name;
  return `[${s.category}] ${s.name}`;
}

function CategoryPanel(props: {
  subjects: StudySubject[];
  selectedSubjectId: string;
  setSelectedSubjectId: (v: string) => void;
  newSubject: string;
  setNewSubject: (v: string) => void;
  onAddSubject: () => Promise<void>;
  currentSubjectName?: string;
  topics: StudyTopic[];
  topicName: string;
  setTopicName: (v: string) => void;
  topicMinutes: string;
  setTopicMinutes: (v: string) => void;
  onAddTopic: () => Promise<void>;
  onRefresh: () => Promise<void>;
}) {
  const {
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    newSubject,
    setNewSubject,
    onAddSubject,
    currentSubjectName,
    topics,
    topicName,
    setTopicName,
    topicMinutes,
    setTopicMinutes,
    onAddTopic,
    onRefresh,
  } = props;

  const { toast } = useToast();
  const [editSubjectId, setEditSubjectId] = useState<string>("");
  const [editSubjectName, setEditSubjectName] = useState<string>("");

  const [bulkText, setBulkText] = useState("");

  const [editTopicId, setEditTopicId] = useState<string>("");
  const [editTopicName, setEditTopicName] = useState<string>("");
  const [editTopicMinutes, setEditTopicMinutes] = useState<string>("");

  function startEditSubject(s: StudySubject) {
    setEditSubjectId(s.id);
    setEditSubjectName(s.name);
  }
  async function saveEditSubject() {
    const name = editSubjectName.trim();
    if (!editSubjectId || !name) return;
    await updateSubject(editSubjectId, { name });
    setEditSubjectId("");
    setEditSubjectName("");
    await onRefresh();
    toast({ title: "Ders güncellendi" });
  }
  function cancelEditSubject() {
    setEditSubjectId("");
    setEditSubjectName("");
  }
  async function confirmDeleteSubject(s: StudySubject) {
    const typed = window.prompt(`Silme onayı için ders adını yazın: ${s.name}`);
    if (typed !== s.name) return;
    const count = getTopicsBySubject(s.id).length;
    if (count > 0) {
      const sure = window.confirm(
        `${count} konu da silinecek. Devam edilsin mi?`,
      );
      if (!sure) return;
      await removeTopicsBySubject(s.id);
    }
    await removeSubject(s.id);
    if (selectedSubjectId === s.id) setSelectedSubjectId("");
    await onRefresh();
    toast({ title: "Ders silindi", description: subjectLabel(s) });
  }

  async function bulkAddTopics() {
    if (!selectedSubjectId) {
      toast({ title: "Önce ders seçin", variant: "destructive" });
      return;
    }
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast({ title: "Geçerli satır yok", variant: "destructive" });
      return;
    }
    let added = 0;
    for (const line of lines) {
      const m = line.match(/^(.*?)[,\-]\s*(\d+)$/);
      const name = m ? m[1].trim() : line;
      const minutes = m ? Number(m[2]) : 0;
      const t: StudyTopic = {
        id: crypto.randomUUID(),
        subjectId: selectedSubjectId,
        name,
        avgMinutes: minutes,
      };
      await addTopic(t);
      added++;
    }
    await onRefresh();
    setBulkText("");
    toast({
      title: "Toplu konu eklendi",
      description: `${added} konu eklendi`,
    });
  }

  function startEditTopic(t: StudyTopic) {
    setEditTopicId(t.id);
    setEditTopicName(t.name);
    setEditTopicMinutes(String(t.avgMinutes));
  }
  async function saveEditTopic() {
    const name = editTopicName.trim();
    const minutes = Number(editTopicMinutes || 0) || 0;
    if (!editTopicId || !name) return;
    await updateTopic(editTopicId, { name, avgMinutes: minutes });
    setEditTopicId("");
    setEditTopicName("");
    setEditTopicMinutes("");
    await onRefresh();
    toast({ title: "Konu güncellendi" });
  }
  function cancelEditTopic() {
    setEditTopicId("");
    setEditTopicName("");
    setEditTopicMinutes("");
  }
  async function confirmDeleteTopic(t: StudyTopic) {
    if (!window.confirm(`Konu silinsin mi? (${t.name})`)) return;
    await removeTopic(t.id);
    await onRefresh();
    toast({ title: "Konu silindi", description: t.name });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Dersler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ders adı"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <Button onClick={onAddSubject}>Ekle</Button>
          </div>
          <div className="divide-y rounded-md border">
            {subjects.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                Henüz ders yok. Yukarıdan ekleyin.
              </div>
            ) : (
              subjects.map((s) => (
                <div
                  key={s.id}
                  className={`flex w-full items-center justify-between p-3 ${selectedSubjectId === s.id ? "bg-accent" : "hover:bg-accent"}`}
                >
                  {editSubjectId === s.id ? (
                    <div className="flex w-full items-center gap-2">
                      <Input
                        value={editSubjectName}
                        onChange={(e) => setEditSubjectName(e.target.value)}
                      />
                      <Button size="sm" onClick={saveEditSubject}>
                        Kaydet
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEditSubject}
                      >
                        İptal
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="text-left"
                        onClick={() => setSelectedSubjectId(s.id)}
                      >
                        {subjectLabel(s)}
                      </button>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditSubject(s)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => confirmDeleteSubject(s)}
                        >
                          Sil
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>
            {currentSubjectName
              ? `Konu Ekle — ${currentSubjectName}`
              : "Konu Ekle"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Konu adı"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
            <Input
              placeholder="Tahmini süre (dk)"
              value={topicMinutes}
              onChange={(e) => setTopicMinutes(e.target.value)}
            />
            <Button onClick={onAddTopic} disabled={!selectedSubjectId}>
              {selectedSubjectId ? "Konu Ekle" : "Önce ders seçin"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Textarea
              className="flex-1"
              placeholder="Toplu ekle: Her satır 'Konu adı - dakika' veya 'Konu adı, dakika'"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={bulkAddTopics}
              disabled={!selectedSubjectId}
            >
              Toplu Ekle
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Konu</TableHead>
                <TableHead className="w-32">Tahmini Süre (dk)</TableHead>
                <TableHead className="w-16">
                  <span className="sr-only">İşlemler</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    {selectedSubjectId
                      ? "Bu ders için konu yok."
                      : "Ders seçin."}
                  </TableCell>
                </TableRow>
              ) : (
                topics.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {editTopicId === t.id ? (
                        <Input
                          value={editTopicName}
                          onChange={(e) => setEditTopicName(e.target.value)}
                        />
                      ) : (
                        t.name
                      )}
                    </TableCell>
                    <TableCell className="w-32">
                      {editTopicId === t.id ? (
                        <Input
                          value={editTopicMinutes}
                          onChange={(e) => setEditTopicMinutes(e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        t.avgMinutes
                      )}
                    </TableCell>
                    <TableCell className="w-16">
                      {editTopicId === t.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEditTopic}>
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditTopic}
                          >
                            İptal
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label="İşlemler">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditTopic(t)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteTopic(t)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
