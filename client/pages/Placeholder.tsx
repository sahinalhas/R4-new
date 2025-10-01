import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sayfa Yakında</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {description || "Bu modül için ayrıntılı ekranları birlikte oluşturabiliriz. İsterseniz bu sayfayı doldurmamı söyleyin."}
        </CardContent>
      </Card>
    </div>
  );
}
