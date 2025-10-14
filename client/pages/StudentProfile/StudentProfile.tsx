import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useStudentProfile, useStudentData } from "@/hooks/student-profile";
import { StudentHeader } from "./components";
import { StudentProfileTabs } from "./StudentProfileTabs";

export default function StudentProfile() {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(0);
  const [scoresData, setScoresData] = useState<any>(null);
  const [loadingScores, setLoadingScores] = useState(false);
  
  const { student, studentId, isLoading, error } = useStudentProfile(id);
  const { data } = useStudentData(studentId, refresh);

  const handleUpdate = () => setRefresh((x) => x + 1);

  // Fetch standardized scores and profile completeness
  useEffect(() => {
    if (!studentId) return;
    
    setLoadingScores(true);
    fetch(`/api/student-profile/${studentId}/scores`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setScoresData(result.data);
        }
      })
      .catch(err => console.error('Error loading scores:', err))
      .finally(() => setLoadingScores(false));
  }, [studentId, refresh]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yükleniyor...</CardTitle>
          <CardDescription>Öğrenci bilgileri yükleniyor</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Hata Oluştu
          </CardTitle>
          <CardDescription>
            Öğrenci verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/ogrenci">Listeye Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Öğrenci bulunamadı</CardTitle>
          <CardDescription>No: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/ogrenci">Listeye Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <StudentHeader student={student} />

      <StudentProfileTabs
        student={student}
        studentId={studentId as string}
        data={data}
        onUpdate={handleUpdate}
        scoresData={scoresData}
        loadingScores={loadingScores}
      />
    </div>
  );
}
