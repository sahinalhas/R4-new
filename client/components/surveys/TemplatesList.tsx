import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SurveyTemplate, SurveyTemplateType } from "@/lib/survey-types";
import SurveyCreationDialog from "./SurveyCreationDialog";

interface TemplatesListProps {
  templates: SurveyTemplate[];
  onRefresh: () => void;
  onDistribute: (template: SurveyTemplate) => void;
}

const getTypeBadge = (type: SurveyTemplateType) => {
  const typeStyles = {
    MEB_STANDAR: "bg-blue-100 text-blue-700",
    OZEL: "bg-purple-100 text-purple-700",
    AKADEMIK: "bg-orange-100 text-orange-700",
    SOSYAL: "bg-green-100 text-green-700",
    REHBERLIK: "bg-yellow-100 text-yellow-700",
  };

  const typeLabels = {
    MEB_STANDAR: "MEB Standart",
    OZEL: "Özel",
    AKADEMIK: "Akademik",
    SOSYAL: "Sosyal",
    REHBERLIK: "Rehberlik",
  };

  return (
    <Badge className={typeStyles[type]}>
      {typeLabels[type]}
    </Badge>
  );
};

export default function TemplatesList({ templates, onRefresh, onDistribute }: TemplatesListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Anket Şablonları</CardTitle>
            <CardDescription>
              Mevcut anket şablonları ve MEB standart anketleri
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              MEB Şablonları
            </Button>
            <SurveyCreationDialog onSurveyCreated={onRefresh}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Şablon
              </Button>
            </SurveyCreationDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>Hedef Sınıf</TableHead>
              <TableHead>MEB Uyumlu</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <p>Henüz anket şablonu bulunmuyor</p>
                    <p className="text-sm">Başlamak için yeni bir şablon oluşturun</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>{getTypeBadge(template.type)}</TableCell>
                  <TableCell>{template.estimatedDuration || '-'} dk</TableCell>
                  <TableCell>
                    {template.targetGrades?.join(', ') || 'Tümü'}
                  </TableCell>
                  <TableCell>
                    {template.mebCompliant ? (
                      <Badge className="bg-green-100 text-green-700">✓ Uyumlu</Badge>
                    ) : (
                      <Badge variant="secondary">-</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          İşlemler
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Düzenle</DropdownMenuItem>
                        <DropdownMenuItem>Kopyala</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDistribute(template)}>
                          Dağıt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
