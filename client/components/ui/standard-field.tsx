import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StandardFieldProps {
  label: string;
  value?: string;
  detailValue?: string;
  onValueChange?: (value: string) => void;
  onDetailChange?: (detail: string) => void;
  children: React.ReactNode;
  required?: boolean;
  description?: string;
}

export function StandardField({
  label,
  value,
  detailValue,
  onValueChange,
  onDetailChange,
  children,
  required = false,
  description,
}: StandardFieldProps) {
  const [showDetail, setShowDetail] = useState(!!detailValue);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button
          type="button"
          variant={showDetail ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setShowDetail(!showDetail)}
          className="shrink-0"
          title={showDetail ? "Detayı gizle" : "Detay ekle"}
        >
          <MessageSquare className="h-4 w-4" />
          {showDetail ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {children}

        {showDetail && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-xs text-muted-foreground">
              📝 Detay & Açıklama (Opsiyonel)
            </Label>
            <Textarea
              value={detailValue || ""}
              onChange={(e) => onDetailChange?.(e.target.value)}
              placeholder="İstediğiniz detayları, gözlemleri veya ek bilgileri buraya yazabilirsiniz..."
              className="mt-1 min-h-[80px] resize-y"
            />
          </div>
        )}
      </div>
    </div>
  );
}
