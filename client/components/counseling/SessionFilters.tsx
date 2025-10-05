import { Filter, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SessionFilters, CounselingTopic } from "./types";

interface SessionFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  topics: CounselingTopic[];
  isApplying?: boolean;
}

export default function SessionFiltersComponent({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  topics,
  isApplying = false,
}: SessionFiltersProps) {
  const handleFilterChange = (key: keyof SessionFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtreler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Başlangıç Tarihi</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Bitiş Tarihi</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="topic">Konu</Label>
            <Select
              value={filters.topic || 'all'}
              onValueChange={(value) => handleFilterChange('topic', value)}
            >
              <SelectTrigger id="topic">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.title}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="className">Sınıf</Label>
            <Input
              id="className"
              placeholder="Örn: 9/A"
              value={filters.className || ''}
              onChange={(e) => handleFilterChange('className', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Durum</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="completed">Tamamlanan</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="participantType">Katılımcı Tipi</Label>
            <Select
              value={filters.participantType || 'all'}
              onValueChange={(value) => handleFilterChange('participantType', value)}
            >
              <SelectTrigger id="participantType">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="öğrenci">Öğrenci</SelectItem>
                <SelectItem value="veli">Veli</SelectItem>
                <SelectItem value="öğretmen">Öğretmen</SelectItem>
                <SelectItem value="diğer">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sessionType">Görüşme Tipi</Label>
            <Select
              value={filters.sessionType || 'all'}
              onValueChange={(value) => handleFilterChange('sessionType', value)}
            >
              <SelectTrigger id="sessionType">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="individual">Bireysel</SelectItem>
                <SelectItem value="group">Grup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sessionMode">Görüşme Şekli</Label>
            <Select
              value={filters.sessionMode || 'all'}
              onValueChange={(value) => handleFilterChange('sessionMode', value)}
            >
              <SelectTrigger id="sessionMode">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="yüz_yüze">Yüz yüze</SelectItem>
                <SelectItem value="telefon">Telefon</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onApplyFilters} disabled={isApplying}>
            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Filtrele
          </Button>
          <Button variant="outline" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Temizle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
