import * as XLSX from 'xlsx';
import { getExamFormat, type ExamFormat, type ExamSection } from '../../../../shared/constants/exam-formats.js';

/**
 * Excel Template Generator Service
 * Her sınav tipi için uygun Excel şablonu oluşturur
 */

interface TemplateColumn {
  header: string;
  key: string;
  width?: number;
}

export class ExcelTemplateService {
  /**
   * Sınav tipine göre Excel template oluşturur
   */
  generateMockExamTemplate(examType: string): Buffer {
    const format = getExamFormat(examType);
    if (!format) {
      throw new Error(`Geçersiz sınav tipi: ${examType}`);
    }

    const workbook = XLSX.utils.book_new();
    
    // Ana sayfa - Öğrenci sonuçları
    const mainSheet = this.createMainSheet(format);
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Sınav Sonuçları');
    
    // Bilgi sayfası
    const infoSheet = this.createInfoSheet(format);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Bilgi');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Ana sonuç sayfası oluşturur
   */
  private createMainSheet(format: ExamFormat): XLSX.WorkSheet {
    const columns = this.getColumnsForFormat(format);
    const headers = columns.map(col => col.header);
    
    // Örnek veri satırları
    const exampleRows = [
      this.createExampleRow(format, '12345', 'Ahmet Yılmaz'),
      this.createExampleRow(format, '12346', 'Ayşe Demir'),
    ];
    
    const data = [headers, ...exampleRows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Sütun genişlikleri
    worksheet['!cols'] = columns.map(col => ({ wch: col.width || 12 }));
    
    return worksheet;
  }

  /**
   * Bilgi sayfası oluşturur
   */
  private createInfoSheet(format: ExamFormat): XLSX.WorkSheet {
    const info = [
      ['SINAV BİLGİLERİ'],
      [],
      ['Sınav Türü:', format.name],
      ['Toplam Soru:', format.totalQuestions],
      ['Süre (dk):', format.totalTimeMinutes],
      [],
      ['DERS YAPISI'],
      [],
      ['Ders Adı', 'Soru Sayısı'],
      ...this.getSectionsInfo(format.sections),
      [],
      ['KULLANIM TALİMATLARI'],
      [],
      ['1. "Sınav Sonuçları" sayfasına öğrenci bilgilerini girin'],
      ['2. Her ders için Doğru (D), Yanlış (Y) ve Boş (B) sayılarını doldurun'],
      ['3. Net otomatik hesaplanacaktır: Net = Doğru - (Yanlış / 4)'],
      ['4. Dosyayı kaydedin ve sisteme yükleyin'],
      [],
      ['ÖNEMLİ NOTLAR'],
      [],
      ['- Öğrenci No ve İsim sütunları zorunludur'],
      ['- Tüm sayısal değerler 0 veya pozitif olmalıdır'],
      ['- Doğru + Yanlış + Boş = Toplam soru sayısı olmalıdır'],
    ];
    
    return XLSX.utils.aoa_to_sheet(info);
  }

  /**
   * Sınav formatına göre sütunları döndürür
   */
  private getColumnsForFormat(format: ExamFormat): TemplateColumn[] {
    const baseColumns: TemplateColumn[] = [
      { header: 'Öğrenci No', key: 'studentId', width: 15 },
      { header: 'Öğrenci Adı', key: 'studentName', width: 25 },
    ];

    const sectionColumns: TemplateColumn[] = [];
    
    for (const section of format.sections) {
      if (section.subsections && section.subsections.length > 0) {
        // Alt bölümler varsa (örn: TYT Sosyal Bilimler)
        for (const subsection of section.subsections) {
          sectionColumns.push(
            { header: `${subsection.name} D`, key: `${subsection.id}_correct`, width: 10 },
            { header: `${subsection.name} Y`, key: `${subsection.id}_wrong`, width: 10 },
            { header: `${subsection.name} B`, key: `${subsection.id}_empty`, width: 10 },
            { header: `${subsection.name} Net`, key: `${subsection.id}_net`, width: 12 },
          );
        }
      } else {
        // Tek bölüm
        sectionColumns.push(
          { header: `${section.name} D`, key: `${section.id}_correct`, width: 10 },
          { header: `${section.name} Y`, key: `${section.id}_wrong`, width: 10 },
          { header: `${section.name} B`, key: `${section.id}_empty`, width: 10 },
          { header: `${section.name} Net`, key: `${section.id}_net`, width: 12 },
        );
      }
    }

    return [
      ...baseColumns,
      ...sectionColumns,
      { header: 'Toplam Net', key: 'totalNet', width: 12 },
    ];
  }

  /**
   * Örnek veri satırı oluşturur
   */
  private createExampleRow(format: ExamFormat, studentId: string, studentName: string): any[] {
    const row: any[] = [studentId, studentName];
    
    for (const section of format.sections) {
      if (section.subsections && section.subsections.length > 0) {
        for (const subsection of section.subsections) {
          const correct = Math.floor(Math.random() * subsection.questionCount);
          const wrong = Math.floor(Math.random() * (subsection.questionCount - correct));
          const empty = subsection.questionCount - correct - wrong;
          const net = correct - wrong / 4;
          row.push(correct, wrong, empty, net.toFixed(2));
        }
      } else {
        const correct = Math.floor(Math.random() * section.questionCount);
        const wrong = Math.floor(Math.random() * (section.questionCount - correct));
        const empty = section.questionCount - correct - wrong;
        const net = correct - wrong / 4;
        row.push(correct, wrong, empty, net.toFixed(2));
      }
    }
    
    // Toplam net (örnek)
    const totalNet = Math.floor(Math.random() * format.totalQuestions * 0.7);
    row.push(totalNet.toFixed(2));
    
    return row;
  }

  /**
   * Bölüm bilgilerini döndürür
   */
  private getSectionsInfo(sections: ExamSection[]): any[][] {
    const info: any[][] = [];
    
    for (const section of sections) {
      if (section.subsections && section.subsections.length > 0) {
        info.push([section.name, '']);
        for (const subsection of section.subsections) {
          info.push([`  - ${subsection.name}`, subsection.questionCount]);
        }
      } else {
        info.push([section.name, section.questionCount]);
      }
    }
    
    return info;
  }
}

export const excelTemplateService = new ExcelTemplateService();
