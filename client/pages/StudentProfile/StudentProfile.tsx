import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentProfile, useStudentData } from "@/hooks/student-profile";
import { StudentHeader, StudentStats } from "./components";
import { StudentProfileTabs } from "./StudentProfileTabs";

export default function StudentProfile() {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(0);
  
  const { student, studentId } = useStudentProfile(id);
  const { data } = useStudentData(studentId, refresh);

  const handleUpdate = () => setRefresh((x) => x + 1);

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
      
      <StudentStats
        student={student}
        attendanceRecords={data.attendanceRecords}
        surveyResults={data.surveyResults}
        interventions={data.interventions}
      />

      <StudentProfileTabs
        student={student}
        studentId={studentId as string}
        data={data}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
