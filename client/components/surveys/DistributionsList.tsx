import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Upload, Link2, BarChart, Users } from "lucide-react";
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
import { SurveyDistribution, DistributionStatus } from "@/lib/survey-types";

interface DistributionsListProps {
  distributions: SurveyDistribution[];
  onNewDistribution: () => void;
}

const getStatusBadge = (status: DistributionStatus) => {
  const statusStyles = {
    DRAFT: "bg-gray-100 text-gray-700",
    ACTIVE: "bg-green-100 text-green-700",
    CLOSED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-blue-100 text-blue-700",
  };

  const statusLabels = {
    DRAFT: "Taslak",
    ACTIVE: "Aktif",
    CLOSED: "Kapalı",
    ARCHIVED: "Arşivlenmiş",
  };

  return (
    <Badge className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
};

export default function DistributionsList({ distributions, onNewDistribution }: DistributionsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Anket Dağıtımları</CardTitle>
            <CardDescription>
              Sınıflara dağıtılmış anketler ve durumları
            </CardDescription>
          </div>
          <Button size="sm" onClick={onNewDistribution}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Dağıtım
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anket</TableHead>
              <TableHead>Dağıtım Türü</TableHead>
              <TableHead>Hedef Sınıflar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Yanıt Sayısı</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>Henüz anket dağıtımı bulunmuyor</p>
                    <p className="text-sm">Bir anket şablonu seçip dağıtmaya başlayın</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              distributions.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell className="font-medium">{distribution.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {distribution.distributionType === 'MANUAL_EXCEL' && 'Excel Şablonu'}
                      {distribution.distributionType === 'ONLINE_LINK' && 'Online Link'}
                      {distribution.distributionType === 'HYBRID' && 'Hibrit'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {distribution.targetClasses?.join(', ') || 'Tümü'}
                  </TableCell>
                  <TableCell>{getStatusBadge(distribution.status)}</TableCell>
                  <TableCell>0 / {distribution.targetStudents?.length || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          İşlemler
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Excel İndir
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="mr-2 h-4 w-4" />
                          Link Kopyala
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Upload className="mr-2 h-4 w-4" />
                          Excel Yükle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart className="mr-2 h-4 w-4" />
                          Sonuçları Gör
                        </DropdownMenuItem>
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
