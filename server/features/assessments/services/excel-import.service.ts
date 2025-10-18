import * as XLSX from 'xlsx';
import type { MockExamBulkUpload, SubjectGradeBulkUpload } from '@shared/types/assessment.types';

/**
 * Excel/CSV Import Service
 * Handles parsing and validation of uploaded assessment data
 */
export class ExcelImportService {
  
  /**
   * Parse mock exam results from Excel/CSV file
   */
  parseMockExamFile(buffer: Buffer): {
    examType: string;
    examProvider: string;
    examNumber: string;
    examDate: string;
    className: string;
    students: Array<{
      studentId: string;
      studentName?: string;
      sections: Array<{
        sectionName: string;
        correct: number;
        wrong: number;
        empty: number;
      }>;
    }>;
  } {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    if (data.length === 0) {
      throw new Error('Excel dosyası boş');
    }

    // Extract metadata from first row or dedicated metadata sheet
    const firstRow = data[0];
    const examType = firstRow['Sınav Türü'] || firstRow['examType'] || 'TYT';
    const examProvider = firstRow['Yayın'] || firstRow['provider'] || 'Bilinmiyor';
    const examNumber = firstRow['Deneme No'] || firstRow['examNumber'] || '1';
    const examDate = firstRow['Tarih'] || firstRow['date'] || new Date().toISOString().split('T')[0];
    const className = firstRow['Sınıf'] || firstRow['class'] || '';

    // Parse student results
    const students = data.map(row => {
      const studentId = row['Öğrenci No'] || row['studentId'] || '';
      const studentName = row['Öğrenci Adı'] || row['studentName'] || '';

      // Parse section results - flexible column naming
      const sections = this.parseSectionResults(row);

      return {
        studentId,
        studentName,
        sections
      };
    });

    return {
      examType,
      examProvider,
      examNumber,
      examDate,
      className,
      students
    };
  }

  /**
   * Parse subject grades from Excel/CSV file
   */
  parseSubjectGradesFile(buffer: Buffer): {
    subjectId: string;
    subjectName: string;
    semester: string;
    academicYear: string;
    gradeType: string;
    className: string;
    grades: Array<{
      studentId: string;
      studentName?: string;
      score: number;
      notes?: string;
    }>;
  } {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    if (data.length === 0) {
      throw new Error('Excel dosyası boş');
    }

    // Extract metadata
    const firstRow = data[0];
    const subjectId = firstRow['Ders Kodu'] || firstRow['subjectId'] || '';
    const subjectName = firstRow['Ders Adı'] || firstRow['subjectName'] || '';
    const semester = firstRow['Dönem'] || firstRow['semester'] || '';
    const academicYear = firstRow['Akademik Yıl'] || firstRow['academicYear'] || '';
    const gradeType = firstRow['Not Türü'] || firstRow['gradeType'] || 'YAZILI';
    const className = firstRow['Sınıf'] || firstRow['class'] || '';

    // Parse grades
    const grades = data.map(row => ({
      studentId: row['Öğrenci No'] || row['studentId'] || '',
      studentName: row['Öğrenci Adı'] || row['studentName'] || '',
      score: parseFloat(row['Not'] || row['score'] || '0'),
      notes: row['Notlar'] || row['notes'] || undefined
    }));

    return {
      subjectId,
      subjectName,
      semester,
      academicYear,
      gradeType,
      className,
      grades
    };
  }

  /**
   * Parse section results from a row - handles different column name formats
   */
  private parseSectionResults(row: any): Array<{
    sectionName: string;
    correct: number;
    wrong: number;
    empty: number;
  }> {
    const sections: Array<{
      sectionName: string;
      correct: number;
      wrong: number;
      empty: number;
    }> = [];

    // Common TYT/AYT section names
    const sectionNames = [
      'Türkçe', 'Matematik', 'Fen', 'Sosyal',
      'Geometri', 'Fizik', 'Kimya', 'Biyoloji',
      'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe', 'Din'
    ];

    for (const sectionName of sectionNames) {
      const correctKey = `${sectionName} Doğru` || `${sectionName}_D`;
      const wrongKey = `${sectionName} Yanlış` || `${sectionName}_Y`;
      const emptyKey = `${sectionName} Boş` || `${sectionName}_B`;

      // Try different possible column names
      const correct = row[correctKey] || row[`${sectionName}_correct`] || row[`${sectionName}D`] || 0;
      const wrong = row[wrongKey] || row[`${sectionName}_wrong`] || row[`${sectionName}Y`] || 0;
      const empty = row[emptyKey] || row[`${sectionName}_empty`] || row[`${sectionName}B`] || 0;

      // Only include section if it has data
      if (correct || wrong || empty) {
        sections.push({
          sectionName,
          correct: parseInt(correct.toString()) || 0,
          wrong: parseInt(wrong.toString()) || 0,
          empty: parseInt(empty.toString()) || 0
        });
      }
    }

    return sections;
  }

  /**
   * Validate mock exam data
   */
  validateMockExamData(data: any): string[] {
    const errors: string[] = [];

    if (!data.examType) {
      errors.push('Sınav türü belirtilmemiş');
    }

    if (!data.className) {
      errors.push('Sınıf bilgisi belirtilmemiş');
    }

    if (!data.students || data.students.length === 0) {
      errors.push('Öğrenci sonucu bulunamadı');
    }

    data.students?.forEach((student: any, index: number) => {
      if (!student.studentId) {
        errors.push(`Satır ${index + 1}: Öğrenci numarası eksik`);
      }

      if (!student.sections || student.sections.length === 0) {
        errors.push(`Satır ${index + 1}: Sınav sonucu eksik`);
      }
    });

    return errors;
  }

  /**
   * Validate subject grades data
   */
  validateSubjectGradesData(data: any): string[] {
    const errors: string[] = [];

    if (!data.subjectId) {
      errors.push('Ders kodu belirtilmemiş');
    }

    if (!data.semester) {
      errors.push('Dönem bilgisi belirtilmemiş');
    }

    if (!data.academicYear) {
      errors.push('Akademik yıl belirtilmemiş');
    }

    if (!data.grades || data.grades.length === 0) {
      errors.push('Not bilgisi bulunamadı');
    }

    data.grades?.forEach((grade: any, index: number) => {
      if (!grade.studentId) {
        errors.push(`Satır ${index + 1}: Öğrenci numarası eksik`);
      }

      if (grade.score === undefined || grade.score === null || isNaN(grade.score)) {
        errors.push(`Satır ${index + 1}: Geçerli bir not girilmemiş`);
      }
    });

    return errors;
  }

  /**
   * Generate Excel template for mock exams
   */
  generateMockExamTemplate(examType: 'TYT' | 'AYT' | 'LGS'): Buffer {
    const headers = ['Sınav Türü', 'Yayın', 'Deneme No', 'Tarih', 'Sınıf', 'Öğrenci No', 'Öğrenci Adı'];
    
    // Add section columns based on exam type
    if (examType === 'TYT') {
      headers.push(
        'Türkçe Doğru', 'Türkçe Yanlış', 'Türkçe Boş',
        'Matematik Doğru', 'Matematik Yanlış', 'Matematik Boş',
        'Fen Doğru', 'Fen Yanlış', 'Fen Boş',
        'Sosyal Doğru', 'Sosyal Yanlış', 'Sosyal Boş'
      );
    } else if (examType === 'AYT') {
      headers.push(
        'Matematik Doğru', 'Matematik Yanlış', 'Matematik Boş',
        'Fizik Doğru', 'Fizik Yanlış', 'Fizik Boş',
        'Kimya Doğru', 'Kimya Yanlış', 'Kimya Boş',
        'Biyoloji Doğru', 'Biyoloji Yanlış', 'Biyoloji Boş'
      );
    } else if (examType === 'LGS') {
      headers.push(
        'Türkçe Doğru', 'Türkçe Yanlış', 'Türkçe Boş',
        'Matematik Doğru', 'Matematik Yanlış', 'Matematik Boş',
        'Fen Doğru', 'Fen Yanlış', 'Fen Boş',
        'İnkılap Doğru', 'İnkılap Yanlış', 'İnkılap Boş',
        'Din Doğru', 'Din Yanlış', 'Din Boş',
        'İngilizce Doğru', 'İngilizce Yanlış', 'İngilizce Boş'
      );
    }

    // Create sample row
    const sampleRow = [examType, 'Örnek Yayın', '1. Deneme', new Date().toISOString().split('T')[0], '12-A', '12345', 'Örnek Öğrenci'];
    // Add zeros for all sections
    for (let i = 0; i < (headers.length - 7); i++) {
      sampleRow.push('0');
    }

    const data = [headers, sampleRow];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deneme Sınavı');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate Excel template for subject grades
   */
  generateSubjectGradesTemplate(): Buffer {
    const headers = [
      'Ders Kodu', 'Ders Adı', 'Dönem', 'Akademik Yıl', 'Not Türü', 'Sınıf',
      'Öğrenci No', 'Öğrenci Adı', 'Not', 'Notlar'
    ];

    const sampleRow = [
      'MAT101', 'Matematik', '2024-2025 Güz', '2024-2025', 'YAZILI', '9-A',
      '12345', 'Örnek Öğrenci', '85', 'İyi performans'
    ];

    const data = [headers, sampleRow];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ders Notları');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}
