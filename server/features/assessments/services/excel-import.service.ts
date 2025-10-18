import * as XLSX from 'xlsx';
import type { MockExamBulkUpload, SubjectGradeBulkUpload } from '@shared/types/assessment.types';
import { getExamFormat, calculateNet, type ExamSection } from '../../../../shared/constants/exam-formats.js';

/**
 * Excel/CSV Import Service
 * Handles parsing and validation of uploaded assessment data
 */
export class ExcelImportService {
  
  /**
   * Parse mock exam results from Excel/CSV file
   * Exam format'a göre otomatik parse eder
   */
  parseMockExamFile(buffer: Buffer, examType: string): {
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
        net: number;
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

    // Get exam format
    const format = getExamFormat(examType);
    if (!format) {
      throw new Error(`Geçersiz sınav tipi: ${examType}`);
    }

    // Extract metadata - can be from first row or separate cells
    const firstRow = data[0];
    const examProvider = firstRow['Yayın'] || firstRow['provider'] || 'Yayın Belirtilmemiş';
    const examNumber = firstRow['Deneme No'] || firstRow['examNumber'] || '1. Deneme';
    const examDate = firstRow['Tarih'] || firstRow['date'] || new Date().toISOString().split('T')[0];
    const className = firstRow['Sınıf'] || firstRow['class'] || '';

    // Parse student results based on exam format
    const students = data.map(row => {
      const studentId = row['Öğrenci No'] || row['studentId'] || '';
      const studentName = row['Öğrenci Adı'] || row['studentName'] || '';

      if (!studentId) {
        return null;
      }

      // Parse sections according to exam format
      const sections = this.parseSectionResultsByFormat(row, format.sections);

      return {
        studentId,
        studentName,
        sections
      };
    }).filter(s => s !== null) as any[];

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
   * Parse section results based on exam format
   */
  private parseSectionResultsByFormat(row: any, sections: ExamSection[]): Array<{
    sectionName: string;
    correct: number;
    wrong: number;
    empty: number;
    net: number;
  }> {
    const results: Array<{
      sectionName: string;
      correct: number;
      wrong: number;
      empty: number;
      net: number;
    }> = [];

    for (const section of sections) {
      if (section.subsections && section.subsections.length > 0) {
        // Parse subsections (e.g., TYT Fen -> Fizik, Kimya, Biyoloji)
        for (const subsection of section.subsections) {
          const result = this.parseRowSection(row, subsection.name, subsection.id);
          if (result) {
            results.push(result);
          }
        }
      } else {
        // Parse main section
        const result = this.parseRowSection(row, section.name, section.id);
        if (result) {
          results.push(result);
        }
      }
    }

    return results;
  }

  /**
   * Parse a single section from Excel row
   */
  private parseRowSection(row: any, sectionName: string, sectionId: string): {
    sectionName: string;
    correct: number;
    wrong: number;
    empty: number;
    net: number;
  } | null {
    // Try multiple column name formats
    const correctKeys = [
      `${sectionName} D`,
      `${sectionName} Doğru`,
      `${sectionName}_D`,
      `${sectionId}_correct`,
      `${sectionName}D`,
    ];

    const wrongKeys = [
      `${sectionName} Y`,
      `${sectionName} Yanlış`,
      `${sectionName}_Y`,
      `${sectionId}_wrong`,
      `${sectionName}Y`,
    ];

    const emptyKeys = [
      `${sectionName} B`,
      `${sectionName} Boş`,
      `${sectionName}_B`,
      `${sectionId}_empty`,
      `${sectionName}B`,
    ];

    let correct = 0;
    let wrong = 0;
    let empty = 0;

    // Find correct value
    for (const key of correctKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        correct = parseInt(row[key].toString()) || 0;
        break;
      }
    }

    // Find wrong value
    for (const key of wrongKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        wrong = parseInt(row[key].toString()) || 0;
        break;
      }
    }

    // Find empty value
    for (const key of emptyKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        empty = parseInt(row[key].toString()) || 0;
        break;
      }
    }

    // Only include if has any data
    if (correct === 0 && wrong === 0 && empty === 0) {
      return null;
    }

    const net = calculateNet(correct, wrong);

    return {
      sectionName,
      correct,
      wrong,
      empty,
      net
    };
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
