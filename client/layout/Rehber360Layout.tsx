import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sun,
  Moon,
  Users2,
  CalendarDays,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldAlert,
  FolderKanban,
  Download,
  Search,
  Bot,
  Brain,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { loadSettings, updateSettings, SETTINGS_KEY, AppSettings } from "@/lib/app-settings";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent"
    >
      <div className="size-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-extrabold">
        R
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold">Rehber360</div>
        <div className="text-[10px] text-muted-foreground">
          Dijital Rehberlik Sistemi
        </div>
      </div>
    </Link>
  );
}

function useBreadcrumbs() {
  const location = useLocation();
  const crumbs = useMemo(() => {
    const map: Record<string, string> = {
      "": "Ana Sayfa",
      ogrenci: "Öğrenci Yönetimi",
      gorusmeler: "Görüşmeler",
      anketler: "Anket & Test",
      raporlar: "Raporlama",
      etkinlikler: "Etkinlikler",
      ayarlar: "Ayarlar",
      risk: "Risk Takip",
      istatistik: "İstatistikler",
      "ai-asistan": "AI Asistan",
      "ai-insights": "AI Insights",
    };
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.map((p, i) => ({
      key: p,
      label: map[p] || p,
      to: "/" + parts.slice(0, i + 1).join("/"),
    }));
  }, [location.pathname]);
  return crumbs;
}

export default function Rehber360Layout() {
  const [dark, setDark] = useState(false);
  const [account, setAccount] = useState<AppSettings["account"] | undefined>(undefined);
  const initials = useMemo(() => {
    const n = account?.displayName || "";
    const parts = n.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "K";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [account]);
  useEffect(() => {
    loadSettings().then(settings => {
      setDark(settings.theme === "dark");
      setAccount(settings.account);
    });
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        try {
          loadSettings().then(next => {
            setDark(next.theme === "dark");
            setAccount(next.account);
          });
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader>
          <Brand />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Modüller</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Ana Sayfa">
                    <NavLink to="/" end>
                      <BarChart3 /> <span>Ana Sayfa</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Öğrenci Yönetimi">
                    <NavLink to="/ogrenci">
                      <Users2 /> <span>Öğrenci Yönetimi</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Görüşmeler">
                    <NavLink to="/gorusmeler">
                      <CalendarDays /> <span>Görüşmeler</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Anket & Test">
                    <NavLink to="/anketler">
                      <MessageSquare /> <span>Anket & Test</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Raporlama">
                    <NavLink to="/raporlar">
                      <FileText /> <span>Raporlama</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Etkinlikler">
                    <NavLink to="/etkinlikler">
                      <FolderKanban /> <span>Etkinlikler</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Risk Takip">
                    <NavLink to="/risk">
                      <ShieldAlert /> <span>Risk Takip</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="AI Rehber Asistan">
                    <NavLink to="/ai-asistan">
                      <Bot /> <span>AI Asistan</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="AI Günlük Insights">
                    <NavLink to="/ai-insights">
                      <Brain /> <span>AI Insights</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="İstatistikler">
                    <NavLink to="/istatistik">
                      <BarChart3 /> <span>İstatistikler</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Ayarlar">
                    <NavLink to="/ayarlar">
                      <Settings /> <span>Ayarlar</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b bg-gradient-to-b from-background/70 to-background/40 supports-[backdrop-filter]:backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Ana Sayfa</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((c, i) => (
                  <Fragment key={c.key}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {i === crumbs.length - 1 ? (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={c.to}>{c.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCmdOpen(true)}
                aria-label="Komut Menüsü"
                title="Komut Menüsü (⌘K / Ctrl+K)"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDark((v) => {
                    const next = !v;
                    updateSettings({ theme: next ? "dark" : "light" });
                    return next;
                  })
                }
                aria-label="Tema Değiştir"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hızlı Erişim</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar?tab=genel#account">Profil Düzenle</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar?tab=bildirim#notifications">
                      Bildirimler
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/ayarlar">Ayarlar</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8">
          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <CommandInput placeholder="Ara veya komut yazın..." />
            <CommandList>
              <CommandEmpty>Kayıt bulunamadı</CommandEmpty>
              <CommandGroup heading="Gezinme">
                <CommandItem
                  onSelect={() => {
                    navigate("/");
                    setCmdOpen(false);
                  }}
                >
                  Ana Sayfa
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/ogrenci");
                    setCmdOpen(false);
                  }}
                >
                  Öğrenci Yönetimi
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/gorusmeler");
                    setCmdOpen(false);
                  }}
                >
                  Görüşmeler
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/raporlar");
                    setCmdOpen(false);
                  }}
                >
                  Raporlama
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/ayarlar");
                    setCmdOpen(false);
                  }}
                >
                  Ayarlar
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Eylemler">
                <CommandItem
                  onSelect={() => {
                    setDark((v) => {
                      const next = !v;
                      updateSettings({ theme: next ? "dark" : "light" });
                      return next;
                    });
                    setCmdOpen(false);
                  }}
                >
                  Tema değiştir
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
