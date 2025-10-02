import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  loadSettings,
  saveSettings,
  updateSettings,
  AppSettings,
  defaultSettings,
  HierarchicalTopicCategory,
} from "@/lib/app-settings";
import Courses from "@/pages/Courses";
import ClassPeriodsEditor from "@/pages/components/ClassPeriodsEditor";
import HierarchicalTopicsEditor from "@/pages/components/HierarchicalTopicsEditor";
import { useSearchParams, useLocation } from "react-router-dom";

const schema = z.object({
  theme: z.enum(["light", "dark"]),
  language: z.enum(["tr", "en"]),
  dateFormat: z.enum(["dd.MM.yyyy", "yyyy-MM-dd"]),
  timeFormat: z.enum(["HH:mm", "hh:mm a"]),
  weekStart: z.union([z.literal(1), z.literal(7)]),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    digestHour: z.number().int().min(0).max(23),
  }),
  data: z.object({
    autosave: z.boolean(),
    autosaveInterval: z.number().int().min(1).max(60),
    anonymizeOnExport: z.boolean(),
    backupFrequency: z.enum(["never", "weekly", "monthly"]),
  }),
  integrations: z.object({
    mebisEnabled: z.boolean(),
    mebisToken: z.string().optional().nullable(),
    eokulEnabled: z.boolean(),
    eokulApiKey: z.string().optional().nullable(),
  }),
  privacy: z.object({
    analyticsEnabled: z.boolean(),
    dataSharingEnabled: z.boolean(),
  }),
  account: z.object({
    displayName: z.string().min(1),
    email: z.string().email(),
    institution: z.string().min(1),
    signature: z.string().optional().nullable(),
  }),
  school: z
    .object({
      periods: z
        .array(
          z.object({
            start: z.string().regex(/^\d{2}:\d{2}$/),
            end: z.string().regex(/^\d{2}:\d{2}$/),
          }),
        )
        .default([]),
    })
    .default({ periods: [] }),
  hierarchicalMeetingTopics: z.array(z.any()).default([]),
});

function EmbeddedCourses() {
  return (
    <div className="mt-4">
      <Courses />
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [init, setInit] = useState<AppSettings>(defaultSettings());
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = useMemo(() => {
    const t = searchParams.get("tab") || "genel";
    const allowed = new Set([
      "genel",
      "bildirim",
      "veri",
      "entegrasyon",
      "dersler",
      "konular",
      "saatler",
      "guvenlik",
      "transfer",
    ]);
    return allowed.has(t) ? t : "genel";
  }, [searchParams]);
  const [tab, setTab] = useState<string>(initialTab);
  const [topicsLocked, setTopicsLocked] = useState<boolean>(true);
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          0,
        );
      }
    }
  }, [location.hash, tab]);
  const form = useForm<AppSettings>({
    resolver: zodResolver(schema) as any,
    defaultValues: init,
    mode: "onChange",
  });

  useEffect(() => {
    loadSettings().then(settings => {
      setInit(settings);
      form.reset(settings);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (!value) return;
      // instant apply theme when toggled
      if (name === "theme") {
        const root = document.documentElement;
        if (value.theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const onSave = async (values: AppSettings) => {
    await saveSettings(values);
  };

  const onReset = async () => {
    const def = defaultSettings();
    await saveSettings(def);
    form.reset(def);
    const root = document.documentElement;
    if (def.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    toast({ title: "Ayarlar varsayılana döndü" });
  };

  const onExport = () => {
    const data = JSON.stringify(form.getValues(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rehber360-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const parsed = schema.parse(json) as AppSettings;
      await saveSettings(parsed);
      form.reset(parsed);
      const root = document.documentElement;
      if (parsed.theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      toast({ title: "Ayarlar içe aktarıldı" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Geçersiz ayar dosyası",
        description: "JSON şeması hatalı",
      });
    } finally {
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Sistem Ayarları</h1>
            <p className="text-muted-foreground mt-1">
              Uygulama genel tercihleri
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={form.handleSubmit(onSave as any)}>Kaydet</Button>
          </div>
        </div>
      </div>
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v);
          setSearchParams((p) => {
            const np = new URLSearchParams(p);
            np.set("tab", v);
            return np;
          });
        }}
      >
        <TabsList>
          <TabsTrigger value="genel">Genel</TabsTrigger>
          <TabsTrigger value="bildirim">Bildirimler</TabsTrigger>
          <TabsTrigger value="veri">Veri</TabsTrigger>
          <TabsTrigger value="entegrasyon">Entegrasyonlar</TabsTrigger>
          <TabsTrigger value="dersler">Dersler & Konular</TabsTrigger>
          <TabsTrigger value="konular">Görüşme Konuları</TabsTrigger>
          <TabsTrigger value="saatler">Ders Saatleri</TabsTrigger>
          <TabsTrigger value="guvenlik">Güvenlik</TabsTrigger>
          <TabsTrigger value="transfer">İçe/Dışa Aktar</TabsTrigger>
        </TabsList>
        <TabsContent value="genel" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm</CardTitle>
              <CardDescription>Tema ve dil tercihi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Tema</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant={
                      form.watch("theme") === "light" ? "default" : "outline"
                    }
                    onClick={() =>
                      form.setValue("theme", "light", { shouldValidate: true })
                    }
                  >
                    Açık
                  </Button>
                  <Button
                    type="button"
                    variant={
                      form.watch("theme") === "dark" ? "default" : "outline"
                    }
                    onClick={() =>
                      form.setValue("theme", "dark", { shouldValidate: true })
                    }
                  >
                    Koyu
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Dil</Label>
                <Select
                  value={form.watch("language")}
                  onValueChange={(v) =>
                    form.setValue("language", v as AppSettings["language"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateFormat">Tarih Formatı</Label>
                <Select
                  value={form.watch("dateFormat")}
                  onValueChange={(v) =>
                    form.setValue(
                      "dateFormat",
                      v as AppSettings["dateFormat"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd.MM.yyyy">dd.MM.yyyy</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeFormat">Saat Formatı</Label>
                <Select
                  value={form.watch("timeFormat")}
                  onValueChange={(v) =>
                    form.setValue(
                      "timeFormat",
                      v as AppSettings["timeFormat"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="timeFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm">24 Saat (HH:mm)</SelectItem>
                    <SelectItem value="hh:mm a">12 Saat (hh:mm a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weekStart">Haftanın İlk Günü</Label>
                <Select
                  value={String(form.watch("weekStart"))}
                  onValueChange={(v) =>
                    form.setValue("weekStart", Number(v) as 1 | 7, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="weekStart">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Pazartesi</SelectItem>
                    <SelectItem value="7">Pazar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card id="account">
            <CardHeader>
              <CardTitle>Hesap</CardTitle>
              <CardDescription>Kullanıcı bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Ad Soyad</Label>
                <Input
                  id="displayName"
                  value={form.watch("account.displayName")}
                  onChange={(e) =>
                    form.setValue("account.displayName", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.watch("account.email")}
                  onChange={(e) =>
                    form.setValue("account.email", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="institution">Kurum</Label>
                <Input
                  id="institution"
                  value={form.watch("account.institution")}
                  onChange={(e) =>
                    form.setValue("account.institution", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signature">İmza / Not</Label>
                <Textarea
                  id="signature"
                  value={form.watch("account.signature") ?? ""}
                  onChange={(e) =>
                    form.setValue("account.signature", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bildirim">
          <Card id="notifications">
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
              <CardDescription>
                E-posta, SMS ve bildirim ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>E-posta Bildirimleri</Label>
                <Switch
                  checked={form.watch("notifications.email")}
                  onCheckedChange={(v) =>
                    form.setValue("notifications.email", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Bildirimleri</Label>
                <Switch
                  checked={form.watch("notifications.sms")}
                  onCheckedChange={(v) =>
                    form.setValue("notifications.sms", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Anlık Bildirimler</Label>
                <Switch
                  checked={form.watch("notifications.push")}
                  onCheckedChange={(v) =>
                    form.setValue("notifications.push", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="digestHour">Günlük Özet Saati</Label>
                <Input
                  id="digestHour"
                  type="number"
                  min={0}
                  max={23}
                  value={form.watch("notifications.digestHour")}
                  onChange={(e) =>
                    form.setValue(
                      "notifications.digestHour",
                      Number(e.target.value),
                      { shouldValidate: true },
                    )
                  }
                />
                <p className="text-xs text-muted-foreground">
                  0-23 arası bir saat
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="veri" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Veri ve Yedekleme</CardTitle>
              <CardDescription>Otomatik kaydetme ve yedekleme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Otomatik Kaydet</Label>
                <Switch
                  checked={form.watch("data.autosave")}
                  onCheckedChange={(v) =>
                    form.setValue("data.autosave", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="autosaveInterval">
                  Otomatik Kaydetme Aralığı (dk)
                </Label>
                <Input
                  id="autosaveInterval"
                  type="number"
                  min={1}
                  max={60}
                  value={form.watch("data.autosaveInterval")}
                  onChange={(e) =>
                    form.setValue(
                      "data.autosaveInterval",
                      Number(e.target.value),
                      { shouldValidate: true },
                    )
                  }
                />
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                <Select
                  value={form.watch("data.backupFrequency")}
                  onValueChange={(v) =>
                    form.setValue(
                      "data.backupFrequency",
                      v as AppSettings["data"]["backupFrequency"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="backupFrequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Kapalı</SelectItem>
                    <SelectItem value="weekly">Haftalık</SelectItem>
                    <SelectItem value="monthly">Aylık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anon"
                  checked={form.watch("data.anonymizeOnExport")}
                  onCheckedChange={(v) =>
                    form.setValue("data.anonymizeOnExport", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
                <Label htmlFor="anon">
                  Dışa aktarırken verileri anonimleştir
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veri Tutarlılığı</CardTitle>
              <CardDescription>
                KVKK ve anonimleştirme uyarıları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                KVKK kapsamında kişisel verilerin korunması için anonimleştirme
                seçeneklerini etkinleştirebilirsiniz. Yedeklemeler yalnızca bu
                tarayıcıya yerel olarak kaydedilir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entegrasyon" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>MEBBİS</CardTitle>
              <CardDescription>Rapor yükleme entegrasyonu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Etkin</Label>
                <Switch
                  checked={form.watch("integrations.mebisEnabled")}
                  onCheckedChange={(v) =>
                    form.setValue("integrations.mebisEnabled", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mebisToken">Erişim Anahtarı</Label>
                <Input
                  id="mebisToken"
                  value={form.watch("integrations.mebisToken") ?? ""}
                  onChange={(e) =>
                    form.setValue("integrations.mebisToken", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>e-Okul</CardTitle>
              <CardDescription>Öğrenci verisi senkronizasyonu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Etkin</Label>
                <Switch
                  checked={form.watch("integrations.eokulEnabled")}
                  onCheckedChange={(v) =>
                    form.setValue("integrations.eokulEnabled", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eokulApiKey">API Anahtarı</Label>
                <Input
                  id="eokulApiKey"
                  value={form.watch("integrations.eokulApiKey") ?? ""}
                  onChange={(e) =>
                    form.setValue("integrations.eokulApiKey", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guvenlik" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik ve Güvenlik</CardTitle>
              <CardDescription>Analitik ve veri paylaşımı</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="analytics"
                  checked={form.watch("privacy.analyticsEnabled")}
                  onCheckedChange={(v) =>
                    form.setValue("privacy.analyticsEnabled", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
                <Label htmlFor="analytics">
                  Kullanım analitiklerini etkinleştir
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="share"
                  checked={form.watch("privacy.dataSharingEnabled")}
                  onCheckedChange={(v) =>
                    form.setValue("privacy.dataSharingEnabled", !!v, {
                      shouldValidate: true,
                    })
                  }
                />
                <Label htmlFor="share">
                  Anonim veri paylaşımını etkinleştir
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card id="secure-reset">
            <CardHeader>
              <CardTitle>Güvenli Sıfırlama</CardTitle>
              <CardDescription>
                Ayarları varsayılana döndürmeden önce ek onay gereklidir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onExport}>
                  Dışa Aktar (JSON)
                </Button>
                <span className="text-xs text-muted-foreground">
                  İşlemden önce ayarlarınızı yedekleyin.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ack1"
                  checked={ack1}
                  onCheckedChange={(v) => setAck1(!!v)}
                />
                <Label htmlFor="ack1">
                  Tüm ayarların sıfırlanacağını onaylıyorum
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ack2"
                  checked={ack2}
                  onCheckedChange={(v) => setAck2(!!v)}
                />
                <Label htmlFor="ack2">
                  Bu işlemin geri alınamayacağını anladım
                </Label>
              </div>
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="confirmEmail">E-posta ile doğrula</Label>
                <Input
                  id="confirmEmail"
                  placeholder={
                    form.watch("account.email") || "user@example.com"
                  }
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Kayıtlı e-posta adresinizi tam olarak yazın.
                </p>
              </div>
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="confirmCode">Onay ifadesi</Label>
                <Input
                  id="confirmCode"
                  placeholder="SIFIRLA"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Devam etmek için SIFIRLA yazın.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={
                      !(
                        ack1 &&
                        ack2 &&
                        (confirmEmail || "") ===
                          (form.watch("account.email") || "") &&
                        (confirmCode || "").toUpperCase() === "SIFIRLA"
                      )
                    }
                  >
                    Varsayılana Döndür
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Ayarlara geri dönülsün mü?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tüm ayarlar varsayılana dönecek ve bu işlem geri alınamaz.
                      Emin misiniz?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                    <AlertDialogAction onClick={onReset}>
                      Evet, sıfırla
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Ayar Transferi</CardTitle>
              <CardDescription>Yedek al veya içe aktar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button type="button" onClick={onExport}>
                  Dışa Aktar (JSON)
                </Button>
                <div>
                  <input
                    id="importFile"
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={onImport}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("importFile")?.click()
                    }
                  >
                    İçe Aktar
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ayarlar yalnızca bu tarayıcıda yerel olarak saklanır.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dersler">
          {/* İçerik: Courses sayfasını göm */}
          <EmbeddedCourses />
        </TabsContent>

        <TabsContent value="konular">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="topicsLock">Düzenleme kilidi</Label>
                <Switch
                  id="topicsLock"
                  checked={topicsLocked}
                  onCheckedChange={(v) => setTopicsLocked(!!v)}
                />
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={topicsLocked}
                  >
                    Tümünü Temizle
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tüm konuları temizle?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tüm hiyerarşik konu yapısı silinecek ve varsayılana dönecek. Bu işlem geri alınamaz.
                      Emin misiniz?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        form.setValue("hierarchicalMeetingTopics", [], {
                          shouldValidate: true,
                        });
                        toast({ title: "Hiyerarşik konu yapısı temizlendi" });
                      }}
                    >
                      Evet, temizle
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <HierarchicalTopicsEditor
              tabs={form.watch("hierarchicalMeetingTopics") || []}
              onChange={(tabs) =>
                form.setValue("hierarchicalMeetingTopics", tabs, {
                  shouldValidate: true,
                })
              }
              disabled={topicsLocked}
            />
          </div>
        </TabsContent>

        <TabsContent value="saatler">
          <ClassPeriodsEditor
            periods={form.watch("school.periods")}
            onChange={(v) =>
              form.setValue("school.periods", v, { shouldValidate: true })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
