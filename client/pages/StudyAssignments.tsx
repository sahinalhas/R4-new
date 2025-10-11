import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  getStudyAssignmentsByStudent,
  saveStudyAssignment,
  updateStudyAssignment,
  deleteStudyAssignment,
  loadTopics,
  loadSubjects
} from '@/lib/api/study.api';
import type { StudyAssignment } from '@/lib/types/study.types';

export default function StudyAssignments() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<StudyAssignment | null>(null);
  const [formData, setFormData] = useState({
    topicId: '',
    dueDate: '',
    status: 'BEKLEMEDE',
    notes: ''
  });

  const { data: studentsData } = useQuery({
    queryKey: ['/api/students'],
    queryFn: async () => {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      return res.json();
    }
  });

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['study-assignments', selectedStudent],
    queryFn: () => getStudyAssignmentsByStudent(selectedStudent),
    enabled: !!selectedStudent
  });

  const topics = loadTopics();
  const subjects = loadSubjects();

  const createMutation = useMutation({
    mutationFn: (data: Omit<StudyAssignment, 'id'>) => 
      saveStudyAssignment({ ...data, id: crypto.randomUUID() } as StudyAssignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-assignments', selectedStudent] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Ödev oluşturuldu');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudyAssignment> }) =>
      updateStudyAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-assignments', selectedStudent] });
      setIsDialogOpen(false);
      setEditingAssignment(null);
      resetForm();
      toast.success('Ödev güncellendi');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudyAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-assignments', selectedStudent] });
      toast.success('Ödev silindi');
    },
  });

  const resetForm = () => {
    setFormData({
      topicId: '',
      dueDate: '',
      status: 'BEKLEMEDE',
      notes: ''
    });
    setEditingAssignment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topicId || !formData.dueDate) {
      toast.error('Lütfen gerekli alanları doldurun');
      return;
    }

    const assignmentData = {
      studentId: selectedStudent,
      ...formData
    };

    if (editingAssignment) {
      updateMutation.mutate({
        id: editingAssignment.id,
        data: assignmentData
      });
    } else {
      createMutation.mutate(assignmentData);
    }
  };

  const handleEdit = (assignment: StudyAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      topicId: assignment.topicId,
      dueDate: assignment.dueDate,
      status: assignment.status,
      notes: assignment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TAMAMLANDI':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'DEVAM_EDIYOR':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'GECIKTI':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'TAMAMLANDI':
        return 'default';
      case 'DEVAM_EDIYOR':
        return 'secondary';
      case 'GECIKTI':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic?.name || 'Bilinmiyor';
  };

  const getSubjectName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return '';
    const subject = subjects.find(s => s.id === topic.subjectId);
    return subject?.name || '';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Çalışma Ödevleri</h1>
              <p className="text-muted-foreground">
                Öğrencilere ödev atayın ve takip edin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Öğrenci Seç</CardTitle>
            <CardDescription>Ödev yönetimi için öğrenci seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Öğrenci seçin..." />
              </SelectTrigger>
              <SelectContent>
                {studentsData?.students?.map((student: any) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ödevler</CardTitle>
                <CardDescription>
                  {selectedStudent 
                    ? `${assignments.length} ödev bulundu`
                    : 'Öğrenci seçin'}
                </CardDescription>
              </div>
              {selectedStudent && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Yeni Ödev
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAssignment ? 'Ödev Düzenle' : 'Yeni Ödev'}
                      </DialogTitle>
                      <DialogDescription>
                        Ödev bilgilerini girin
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="topicId">Konu *</Label>
                        <Select 
                          value={formData.topicId} 
                          onValueChange={(value) => setFormData({ ...formData, topicId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Konu seçin..." />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((topic) => (
                              <SelectItem key={topic.id} value={topic.id}>
                                {getSubjectName(topic.id)} - {topic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Son Teslim Tarihi *</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Durum</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEKLEMEDE">Beklemede</SelectItem>
                            <SelectItem value="DEVAM_EDIYOR">Devam Ediyor</SelectItem>
                            <SelectItem value="TAMAMLANDI">Tamamlandı</SelectItem>
                            <SelectItem value="GECIKTI">Gecikti</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notlar</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}>
                          İptal
                        </Button>
                        <Button type="submit">
                          {editingAssignment ? 'Güncelle' : 'Oluştur'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedStudent ? (
              <div className="text-center py-12 text-muted-foreground">
                Ödev görüntülemek için bir öğrenci seçin
              </div>
            ) : isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Yükleniyor...
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Henüz ödev bulunmuyor
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Konu</TableHead>
                      <TableHead>Son Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Notlar</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getTopicName(assignment.topicId)}</div>
                            <div className="text-xs text-muted-foreground">
                              {getSubjectName(assignment.topicId)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(assignment.dueDate), 'd MMM yyyy', { locale: tr })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(assignment.status)}
                            className="gap-1"
                          >
                            {getStatusIcon(assignment.status)}
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {assignment.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(assignment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
