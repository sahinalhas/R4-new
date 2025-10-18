import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { getAssessmentTypes, uploadAssessmentExcel } from "@/lib/api/assessments.api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface BulkUploadSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export function BulkUploadSection({ studentId, onUpdate }: BulkUploadSectionProps) {
  const queryClient = useQueryClient();
  const [assessmentTypeId, setAssessmentTypeId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    imported: number;
    errors: string[];
  } | null>(null);

  const { data: assessmentTypes = [] } = useQuery({
    queryKey: ['assessment-types'],
    queryFn: () => getAssessmentTypes(),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !assessmentTypeId) {
        throw new Error("Dosya ve değerlendirme türü seçmelisiniz");
      }
      return uploadAssessmentExcel(selectedFile, assessmentTypeId);
    },
    onSuccess: (data) => {
      setUploadResult(data);
      queryClient.invalidateQueries({ queryKey: ['assessment-summary', studentId] });
      queryClient.invalidateQueries({ queryKey: ['assessment-results', studentId] });
      if (data.success) {
        toast.success(`${data.imported} kayıt başarıyla içe aktarıldı`);
        onUpdate();
      } else {
        toast.error("Yükleme tamamlandı ancak bazı hatalar oluştu");
      }
    },
    onError: (error: any) => {
      toast.error("Dosya yüklenemedi", {
        description: error.message,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  const downloadTemplate = () => {
    const templateData = [
      ["Öğrenci ID", "Adı Soyadı", "Puan", "Maksimum Puan", "Notlar"],
      ["123", "Ahmet Yılmaz", "85", "100", "İyi performans"],
      ["124", "Ayşe Demir", "92", "100", "Çok iyi"],
      ["125", "Mehmet Kaya", "78", "100", "Gelişmeli"],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "\uFEFF";
    
    templateData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "degerlendirme_sablonu.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Toplu Veri Yükleme
          </CardTitle>
          <CardDescription>
            Excel veya CSV dosyası ile birden fazla öğrencinin değerlendirme sonuçlarını yükleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileSpreadsheet className="h-4 w-4" />
            <AlertTitle>Excel/CSV Formatı</AlertTitle>
            <AlertDescription>
              Dosyanız şu sütunları içermelidir: Öğrenci ID, Adı Soyadı, Puan, Maksimum Puan, Notlar (opsiyonel)
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assessmentType">Değerlendirme Türü *</Label>
              <Select value={assessmentTypeId} onValueChange={setAssessmentTypeId}>
                <SelectTrigger id="assessmentType">
                  <SelectValue placeholder="Türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Dosya Seçin *</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Seçilen dosya: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !assessmentTypeId || uploadMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadMutation.isPending ? "Yükleniyor..." : "Yükle"}
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Şablon İndir
              </Button>
            </div>
          </div>

          {uploadResult && (
            <Alert variant={uploadResult.success && uploadResult.errors.length === 0 ? "default" : "destructive"}>
              {uploadResult.success && uploadResult.errors.length === 0 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {uploadResult.success && uploadResult.errors.length === 0 
                  ? "Başarıyla Tamamlandı" 
                  : "Yükleme Sonuçları"}
              </AlertTitle>
              <AlertDescription>
                <p>{uploadResult.message}</p>
                <p className="mt-1">İçe aktarılan kayıt sayısı: {uploadResult.imported}</p>
                {uploadResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Hatalar:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kullanım Talimatları</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>"Şablon İndir" butonuna tıklayarak örnek Excel/CSV dosyasını indirin</li>
            <li>Dosyayı açın ve öğrenci bilgilerini ve puanlarını girin</li>
            <li>Değerlendirme türünü seçin (Deneme Sınavı, Ders Notu, vb.)</li>
            <li>Doldurduğunuz dosyayı seçin ve "Yükle" butonuna tıklayın</li>
            <li>Sistem otomatik olarak verileri işleyecek ve sonuç raporunu gösterecektir</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Not:</strong> Yükleme işlemi sırasında sistemde kayıtlı olmayan öğrenciler atlanacaktır.</p>
            <p>Maksimum dosya boyutu: 10 MB</p>
            <p>Desteklenen formatlar: .xlsx, .xls, .csv</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
}
