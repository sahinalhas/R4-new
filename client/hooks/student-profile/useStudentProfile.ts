import { useState, useEffect, useMemo } from "react";
import { Student, loadStudents } from "@/lib/storage";

export function useStudentProfile(studentId: string | undefined) {
  const [studentsData, setStudentsData] = useState<Student[]>(loadStudents());
  
  useEffect(() => {
    setStudentsData(loadStudents());
    
    const handleUpdate = () => setStudentsData(loadStudents());
    window.addEventListener('studentsUpdated', handleUpdate);
    return () => window.removeEventListener('studentsUpdated', handleUpdate);
  }, []);
  
  const normalizedId = useMemo(() => {
    if (!studentId) return studentId;
    if (studentsData.some((s) => s.id === studentId)) return studentId;
    return studentId;
  }, [studentId, studentsData]);
  
  const student = useMemo(
    () => studentsData.find((s) => s.id === normalizedId),
    [normalizedId, studentsData]
  );

  return {
    student,
    studentId: normalizedId,
  };
}
