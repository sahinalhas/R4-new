import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-6 border border-primary/20">
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        <p className="text-muted-foreground mt-1">Bu modül yakında kullanıma açılacak</p>
      </div>
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/15">
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
